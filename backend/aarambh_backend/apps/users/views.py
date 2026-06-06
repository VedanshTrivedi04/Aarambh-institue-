import bcrypt
import random
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate
from rest_framework import viewsets, status, mixins
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser, OTPRecord
from .serializers import (
    CustomUserSerializer, LoginSerializer, OTPSendSerializer, OTPVerifySerializer,
    ForgotPasswordSerializer, ResetPasswordSerializer
)
from utils.sms import send_sms
from utils.permissions import IsAdmin
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

class AuthViewSet(viewsets.ViewSet):
    """
    Authentication endpoints.
    """
    permission_classes = [AllowAny]

    def _get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    @action(detail=False, methods=['post'], url_path='login')
    def login_email(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        identifier = serializer.validated_data['identifier']
        password = serializer.validated_data['password']
        
        # Resolve identifier: could be email or username
        user_obj = None
        if '@' in identifier:
            user_obj = CustomUser.objects.filter(email=identifier).first()
        else:
            user_obj = CustomUser.objects.filter(username=identifier).first()
        
        if not user_obj:
            return Response(
                {"detail": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Verify password
        user = authenticate(request, email=user_obj.email, password=password)
        
        if not user:
            return Response(
                {"detail": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        
        tokens = self._get_tokens_for_user(user)
        return Response(tokens)

    @action(detail=False, methods=['post'], url_path='login/otp/send')
    def otp_send(self, request):
        serializer = OTPSendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        purpose = serializer.validated_data['purpose']

        # Rate limiting logic can be added here
        
        # Check if user exists (for login)
        if purpose == 'login' and not CustomUser.objects.filter(phone=phone).exists():
             return Response({"detail": "No user found with this phone number"}, status=status.HTTP_404_NOT_FOUND)

        otp_code = str(random.randint(100000, 999999))
        otp_hash = bcrypt.hashpw(otp_code.encode(), bcrypt.gensalt()).decode()
        
        OTPRecord.objects.create(
            phone=phone,
            otp_hash=otp_hash,
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        
        # Send SMS
        send_sms(phone, f"Your Aarambh Institute OTP is {otp_code}. Valid for 10 minutes.")
        
        return Response({"detail": "OTP sent successfully"})

    @action(detail=False, methods=['post'], url_path='login/otp/verify')
    def otp_verify(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        phone = serializer.validated_data['phone']
        otp = serializer.validated_data['otp']
        purpose = serializer.validated_data['purpose']
        
        record = OTPRecord.objects.filter(
            phone=phone, purpose=purpose, is_used=False, expires_at__gt=timezone.now()
        ).order_by('-created_at').first()
        
        if not record:
            return Response({"detail": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)
            
        if record.attempt_count >= record.max_attempts:
             return Response({"detail": "Maximum attempts reached"}, status=status.HTTP_400_BAD_REQUEST)
             
        if not bcrypt.checkpw(otp.encode(), record.otp_hash.encode()):
            record.attempt_count += 1
            record.save(update_fields=['attempt_count'])
            return Response({"detail": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Success
        record.is_used = True
        record.used_at = timezone.now()
        record.save(update_fields=['is_used', 'used_at'])
        
        if purpose == 'login':
            user = CustomUser.objects.get(phone=phone)
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])
            return Response(self._get_tokens_for_user(user))
            
        return Response({"detail": "OTP verified"})

    @action(detail=False, methods=['get', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            serializer = CustomUserSerializer(request.user)
            return Response(serializer.data)
        elif request.method == 'PATCH':
            serializer = CustomUserSerializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD for Users (Admin only)
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated, IsAdmin]
    filterset_fields = ['role', 'is_active']
    search_fields = ['email', 'phone', 'first_name', 'last_name']
    
    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=['is_active'])

    @action(detail=False, methods=['post'], url_path='create-teacher')
    def create_teacher(self, request):
        """
        Creates a single teacher with password and profile.
        """
        from .models import TeacherProfile
        from django.db import transaction
        
        data = request.data
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        username = data.get('username', '').strip() or email
        password = data.get('password', '').strip()
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        qualification = data.get('qualification', '').strip()
        specialization = data.get('specialization', '').strip()

        if not email or not phone or not password:
            return Response({"detail": "Email, Phone, and Password are required."}, status=status.HTTP_400_BAD_REQUEST)
            
        if CustomUser.objects.filter(email=email).exists():
            return Response({"detail": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        if CustomUser.objects.filter(phone=phone).exists():
            return Response({"detail": "Phone already exists."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                user = CustomUser.objects.create_user(
                    username=username,
                    email=email,
                    phone=phone,
                    first_name=first_name,
                    last_name=last_name,
                    role='teacher',
                    password=password
                )
                
                TeacherProfile.objects.create(
                    user=user,
                    qualification=qualification or 'Not Specified',
                    specialization=specialization or 'Not Specified'
                )
                
            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put', 'patch'], url_path='update-teacher')
    def update_teacher(self, request, pk=None):
        """
        Updates a teacher and their profile.
        """
        from .models import TeacherProfile
        from django.db import transaction
        
        user = self.get_object()
        data = request.data
        
        email = data.get('email', user.email).strip()
        phone = data.get('phone', user.phone).strip()
        first_name = data.get('first_name', user.first_name).strip()
        last_name = data.get('last_name', user.last_name).strip()
        
        if CustomUser.objects.exclude(id=user.id).filter(email=email).exists():
            return Response({"detail": "Email already in use."}, status=status.HTTP_400_BAD_REQUEST)
        if CustomUser.objects.exclude(id=user.id).filter(phone=phone).exists():
            return Response({"detail": "Phone already in use."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                user.email = email
                user.phone = phone
                user.first_name = first_name
                user.last_name = last_name
                user.save()
                
                profile = getattr(user, 'teacher_profile', None)
                if profile:
                    if 'qualification' in data:
                        profile.qualification = data['qualification'].strip()
                    if 'specialization' in data:
                        profile.specialization = data['specialization'].strip()
                    profile.save()
                    
            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='bulk-upload-teachers')
    def bulk_upload_teachers(self, request):
        """
        Expects a list of teacher data dictionaries from CSV.
        """
        data = request.data
        if not isinstance(data, list):
            return Response({"detail": "Expected a list of teachers"}, status=status.HTTP_400_BAD_REQUEST)
        
        created_count = 0
        errors = []
        
        from .models import TeacherProfile
        from django.db import transaction
        
        for idx, item in enumerate(data):
            try:
                name_parts = str(item.get('Name', '')).strip().split(' ', 1)
                first_name = name_parts[0] if name_parts else ''
                last_name = name_parts[1] if len(name_parts) > 1 else ''
                
                email = str(item.get('Email', '')).strip()
                phone = str(item.get('Phone', '')).strip()
                qualification = str(item.get('Qualification', '')).strip()
                specialization = str(item.get('Specialization', '')).strip()
                
                if not email or not phone:
                    errors.append(f"Row {idx+2}: Both email and phone are required")
                    continue
                    
                if CustomUser.objects.filter(email=email).exists():
                    errors.append(f"Row {idx+2}: Email {email} already exists")
                    continue
                if CustomUser.objects.filter(phone=phone).exists():
                    errors.append(f"Row {idx+2}: Phone {phone} already exists")
                    continue
                
                with transaction.atomic():
                    user = CustomUser.objects.create_user(
                        username=email,
                        email=email,
                        phone=phone,
                        first_name=first_name,
                        last_name=last_name,
                        role='teacher',
                        password='teacherpassword123'
                    )
                    
                    TeacherProfile.objects.create(
                        user=user,
                        qualification=qualification or 'Not Specified',
                        specialization=specialization or 'Not Specified'
                    )
                    created_count += 1
            except Exception as e:
                errors.append(f"Row {idx+2}: {str(e)}")
                
        return Response({
            "detail": f"Successfully created {created_count} teachers.",
            "errors": errors,
            "created_count": created_count
        })

    @action(detail=False, methods=['post'], url_path='create-student')
    def create_student(self, request):
        """
        Creates a single student with password and profile.
        """
        from .models import StudentProfile
        from django.db import transaction
        
        data = request.data
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        username = data.get('username', '').strip() or email
        password = data.get('password', '').strip()
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        class_grade = data.get('class_grade', '10').strip()
        batch = data.get('batch', '').strip()

        if not email or not phone or not password:
            return Response({"detail": "Email, Phone, and Password are required."}, status=status.HTTP_400_BAD_REQUEST)
            
        if CustomUser.objects.filter(email=email).exists():
            return Response({"detail": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)
        if CustomUser.objects.filter(phone=phone).exists():
            return Response({"detail": "Phone already exists."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                user = CustomUser.objects.create_user(
                    username=username,
                    email=email,
                    phone=phone,
                    first_name=first_name,
                    last_name=last_name,
                    role='student',
                    password=password
                )
                
                StudentProfile.objects.create(
                    user=user,
                    class_grade=class_grade if class_grade in ['10', '11', '12'] else '10',
                    board='cbse',
                    notes=f"Batch: {batch}"
                )
                
            serializer = self.get_serializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='bulk-upload')
    def bulk_upload(self, request):
        """
        Expects a list of student data dictionaries from CSV.
        """
        data = request.data
        if not isinstance(data, list):
            return Response({"detail": "Expected a list of students"}, status=status.HTTP_400_BAD_REQUEST)
        
        created_count = 0
        errors = []
        
        from .models import StudentProfile
        from django.db import transaction
        
        for idx, item in enumerate(data):
            try:
                name_parts = str(item.get('Name', '')).strip().split(' ', 1)
                first_name = name_parts[0] if name_parts else ''
                last_name = name_parts[1] if len(name_parts) > 1 else ''
                
                email = str(item.get('Email', '')).strip()
                phone = str(item.get('Phone', '')).strip()
                batch = str(item.get('Batch', '')).strip()
                class_grade = str(item.get('Class', '')).strip()
                fee_status = str(item.get('FeeStatus', '')).strip()
                
                if not email or not phone:
                    errors.append(f"Row {idx+2}: Both email and phone are required")
                    continue
                    
                if CustomUser.objects.filter(email=email).exists():
                    errors.append(f"Row {idx+2}: Email {email} already exists")
                    continue
                if CustomUser.objects.filter(phone=phone).exists():
                    errors.append(f"Row {idx+2}: Phone {phone} already exists")
                    continue
                
                with transaction.atomic():
                    user = CustomUser.objects.create_user(
                        username=email,
                        email=email,
                        phone=phone,
                        first_name=first_name,
                        last_name=last_name,
                        role='student',
                        password='studentpassword123'
                    )
                    
                    StudentProfile.objects.create(
                        user=user,
                        class_grade=class_grade if class_grade in ['10', '11', '12'] else '10',
                        board='cbse',
                        notes=f"Batch: {batch}, Fee Status: {fee_status}"
                    )
                    created_count += 1
            except Exception as e:
                errors.append(f"Row {idx+2}: {str(e)}")
                
        return Response({
            "detail": f"Successfully created {created_count} students.",
            "errors": errors,
            "created_count": created_count
        })


class PublicTeachersView(ListAPIView):
    """
    Public read-only list of active teachers with their profiles.
    Used by the public website Faculty section.
    """
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return CustomUser.objects.filter(
            role='teacher',
            is_active=True,
        ).select_related('teacher_profile').order_by('first_name')

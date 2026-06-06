import csv
import io
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Avg, Max
from .models import AttendanceSession, AttendanceRecord, Test, Score
from apps.users.models import CustomUser
from .serializers import (
    AttendanceSessionSerializer, AttendanceRecordSerializer,
    TestSerializer, ScoreSerializer, CSVUploadSerializer
)
from utils.permissions import IsTeacherOrAdmin

class AttendanceSessionViewSet(viewsets.ModelViewSet):
    queryset = AttendanceSession.objects.all()
    serializer_class = AttendanceSessionSerializer
    filterset_fields = ['batch', 'date']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'my_attendance']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsTeacherOrAdmin()]

    def perform_create(self, serializer):
        serializer.save(marked_by=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-attendance')
    def my_attendance(self, request):
        if request.user.role != 'student':
            return Response({"detail": "Only students can view their own attendance summary."}, status=status.HTTP_403_FORBIDDEN)
        
        records = AttendanceRecord.objects.filter(student=request.user)
        total = records.count()
        present = records.filter(status='present').count()
        
        return Response({
            "total_sessions": total,
            "present_sessions": present,
            "attendance_percentage": (present / total * 100) if total > 0 else 0,
            "records": AttendanceRecordSerializer(records, many=True).data
        })

class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer
    filterset_fields = ['session', 'student', 'status']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsTeacherOrAdmin()]

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    filterset_fields = ['batch', 'subject']
    search_fields = ['title']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'my_scores']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsTeacherOrAdmin()]

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_scores_csv(self, request, pk=None):
        """
        Upload scores via CSV. Format: email,marks_obtained,remarks
        """
        test = self.get_object()
        serializer = CSVUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        file = serializer.validated_data['file']
        decoded_file = file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        
        created_count = 0
        errors = []
        
        for row in reader:
            email = row.get('email')
            marks = row.get('marks_obtained')
            remarks = row.get('remarks', '')
            
            if not email or not marks:
                errors.append(f"Missing email or marks for row: {row}")
                continue
                
            try:
                student = CustomUser.objects.get(email=email, role='student')
                Score.objects.update_or_create(
                    test=test,
                    student=student,
                    defaults={
                        'marks_obtained': marks,
                        'remarks': remarks
                    }
                )
                created_count += 1
            except CustomUser.DoesNotExist:
                errors.append(f"Student with email {email} not found.")
            except Exception as e:
                errors.append(f"Error processing {email}: {str(e)}")
                
        return Response({
            "message": f"Successfully processed {created_count} scores.",
            "errors": errors
        })

class ScoreViewSet(viewsets.ModelViewSet):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer
    filterset_fields = ['test', 'student']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'my_scores']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsTeacherOrAdmin()]

    @action(detail=False, methods=['get'], url_path='my-scores')
    def my_scores(self, request):
        if request.user.role != 'student':
            return Response({"detail": "Only students can view their own scores."}, status=status.HTTP_403_FORBIDDEN)
            
        scores = Score.objects.filter(student=request.user)
        avg_marks = scores.aggregate(Avg('marks_obtained'))['marks_obtained__avg']
        
        return Response({
            "total_tests": scores.count(),
            "average_marks": avg_marks,
            "scores": ScoreSerializer(scores, many=True).data
        })

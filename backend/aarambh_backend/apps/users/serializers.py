import bcrypt
import random
from datetime import timedelta
from django.utils import timezone
from rest_framework import serializers
from .models import CustomUser, StudentProfile, TeacherProfile, ParentProfile, AdminProfile, OTPRecord

class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = [
            "id", "roll_number", "admission_number", "class_grade", "board", 
            "stream", "date_of_birth", "address_line1", "address_city", 
            "address_state", "address_pincode", "parent_name", "parent_phone", 
            "parent_email", "emergency_phone", "enrollment_date", 
            "previous_school", "previous_percentage", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

class TeacherProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherProfile
        fields = [
            "id", "employee_id", "qualification", "experience_years", "bio",
            "achievement", "specialization", "rating", "rating_count", 
            "joining_date", "is_active_teacher", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "rating", "rating_count", "created_at", "updated_at"]

class ParentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentProfile
        fields = [
            "id", "occupation", "relationship", "alternate_phone", 
            "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminProfile
        fields = [
            "id", "admin_level", "department", "can_manage_fees", 
            "can_delete_content", "can_manage_users", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

class CustomUserSerializer(serializers.ModelSerializer):
    student_profile = StudentProfileSerializer(read_only=True)
    teacher_profile = TeacherProfileSerializer(read_only=True)
    parent_profile = ParentProfileSerializer(read_only=True)
    admin_profile = AdminProfileSerializer(read_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id", "email", "phone", "username", "first_name", "last_name", 
            "role", "profile_photo", "is_active", "date_joined", 
            "last_login", "last_seen_at", "is_online", "created_at", "updated_at",
            "student_profile", "teacher_profile", "parent_profile", "admin_profile"
        ]
        read_only_fields = ["id", "date_joined", "last_login", "last_seen_at", "is_online", "created_at", "updated_at"]

# ─── Auth Serializers ──────────────────────────────────────────────────────────

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(help_text="Email address or username")
    password = serializers.CharField(write_only=True)

class OTPSendSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    purpose = serializers.ChoiceField(choices=["login", "password_reset", "phone_verify"], default="login")

class OTPVerifySerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    otp = serializers.CharField(max_length=6)
    purpose = serializers.ChoiceField(choices=["login", "password_reset", "phone_verify"], default="login")

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

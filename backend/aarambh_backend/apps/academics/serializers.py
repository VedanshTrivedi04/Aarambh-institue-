from rest_framework import serializers
from .models import Subject, Batch, BatchEnrollment
from apps.users.serializers import CustomUserSerializer

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "name", "code", "description", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]

class BatchSerializer(serializers.ModelSerializer):
    subjects_details = SubjectSerializer(source="subjects", many=True, read_only=True)
    primary_teachers_details = CustomUserSerializer(source="primary_teachers", many=True, read_only=True)

    class Meta:
        model = Batch
        fields = [
            "id", "name", "class_grade", "target_exam", "start_date", "end_date",
            "status", "max_capacity", "current_strength", "subjects", "primary_teachers",
            "subjects_details", "primary_teachers_details", "created_at", "updated_at"
        ]
        read_only_fields = ["id", "current_strength", "created_at", "updated_at"]

class BatchEnrollmentSerializer(serializers.ModelSerializer):
    student_details = CustomUserSerializer(source="student", read_only=True)
    batch_details = BatchSerializer(source="batch", read_only=True)

    class Meta:
        model = BatchEnrollment
        fields = [
            "id", "student", "batch", "status", "notes", 
            "student_details", "batch_details", "enrolled_at", "last_updated"
        ]
        read_only_fields = ["id", "enrolled_at", "last_updated"]

    def validate(self, data):
        # Ensure student role
        if data.get("student") and data["student"].role != "student":
            raise serializers.ValidationError({"student": "User must be a student."})
        return data

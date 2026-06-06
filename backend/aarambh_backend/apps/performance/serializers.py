from rest_framework import serializers
from .models import AttendanceSession, AttendanceRecord, Test, Score
from apps.users.serializers import CustomUserSerializer
from apps.academics.serializers import BatchSerializer, SubjectSerializer

class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_details = CustomUserSerializer(source='student', read_only=True)
    
    class Meta:
        model = AttendanceRecord
        fields = ['id', 'session', 'student', 'status', 'remarks', 'student_details', 'created_at']
        read_only_fields = ['id', 'created_at']

class AttendanceSessionSerializer(serializers.ModelSerializer):
    batch_details = BatchSerializer(source='batch', read_only=True)
    records = AttendanceRecordSerializer(many=True, read_only=True)
    
    class Meta:
        model = AttendanceSession
        fields = ['id', 'batch', 'date', 'marked_by', 'batch_details', 'records', 'created_at', 'updated_at']
        read_only_fields = ['id', 'marked_by', 'created_at', 'updated_at']

class ScoreSerializer(serializers.ModelSerializer):
    student_details = CustomUserSerializer(source='student', read_only=True)
    
    class Meta:
        model = Score
        fields = ['id', 'test', 'student', 'marks_obtained', 'rank', 'remarks', 'student_details', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class TestSerializer(serializers.ModelSerializer):
    batch_details = BatchSerializer(source='batch', read_only=True)
    subject_details = SubjectSerializer(source='subject', read_only=True)
    
    class Meta:
        model = Test
        fields = ['id', 'batch', 'subject', 'title', 'date', 'max_marks', 'syllabus', 'batch_details', 'subject_details', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class CSVUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

from rest_framework import serializers
from .models import Enquiry, FollowUp
from apps.users.serializers import CustomUserSerializer

class FollowUpSerializer(serializers.ModelSerializer):
    handled_by_details = CustomUserSerializer(source='handled_by', read_only=True)

    class Meta:
        model = FollowUp
        fields = ['id', 'enquiry', 'handled_by', 'date', 'method', 'summary', 'next_follow_up', 'handled_by_details', 'created_at']
        read_only_fields = ['id', 'handled_by', 'created_at']

class EnquirySerializer(serializers.ModelSerializer):
    follow_ups = FollowUpSerializer(many=True, read_only=True)
    assigned_to_details = CustomUserSerializer(source='assigned_to', read_only=True)

    class Meta:
        model = Enquiry
        fields = [
            'id', 'student_name', 'parent_name', 'phone_number', 'email', 
            'target_exam', 'current_class', 'previous_score', 'status', 
            'source', 'notes', 'assigned_to', 'follow_ups', 'assigned_to_details',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class PublicEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = [
            'student_name', 'parent_name', 'phone_number', 'email',
            'target_exam', 'current_class', 'previous_score', 'source'
        ]

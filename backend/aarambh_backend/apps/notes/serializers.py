from rest_framework import serializers
from .models import Note
from apps.academics.serializers import SubjectSerializer, BatchSerializer

class NoteSerializer(serializers.ModelSerializer):
    subject_details = SubjectSerializer(source='subject', read_only=True)
    batches_details = BatchSerializer(source='batches', many=True, read_only=True)
    
    class Meta:
        model = Note
        fields = [
            'id', 'title', 'description', 'file', 'file_type', 
            'uploaded_by', 'subject', 'batches', 'is_published',
            'subject_details', 'batches_details', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'uploaded_by', 'created_at', 'updated_at']

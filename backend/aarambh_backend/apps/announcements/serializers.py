from rest_framework import serializers
from .models import Announcement, AnnouncementReadReceipt
from apps.academics.serializers import BatchSerializer

class AnnouncementSerializer(serializers.ModelSerializer):
    target_batches_details = BatchSerializer(source='target_batches', many=True, read_only=True)
    is_read = serializers.SerializerMethodField()
    read_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'content', 'attachment', 'author', 'is_global', 
            'target_batches', 'priority', 'target_batches_details', 'is_read', 
            'read_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

    def get_is_read(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return AnnouncementReadReceipt.objects.filter(announcement=obj, user=request.user).exists()
        return False
        
    def get_read_count(self, obj):
        request = self.context.get('request')
        if request and request.user.role in ['admin', 'teacher']:
            return obj.read_receipts.count()
        return None

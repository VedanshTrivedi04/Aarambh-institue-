from rest_framework import serializers
from .models import ChatRoom, Message
from apps.users.serializers import CustomUserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender_details = CustomUserSerializer(source='sender', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'room', 'sender', 'content', 'is_read', 'sender_details', 'created_at']
        read_only_fields = ['id', 'sender', 'created_at']

class ChatRoomSerializer(serializers.ModelSerializer):
    participants_details = CustomUserSerializer(source='participants', many=True, read_only=True)
    latest_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'is_group', 'participants', 'participants_details', 'latest_message', 'unread_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_latest_message(self, obj):
        msg = obj.messages.order_by('-created_at').first()
        if msg:
            return MessageSerializer(msg).data
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0

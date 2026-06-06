from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer

class ChatRoomViewSet(viewsets.ModelViewSet):
    """
    CRUD for ChatRooms. 
    Users can only view and interact with rooms they are participants of.
    """
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(self, 'swagger_fake_view', False):
            return ChatRoom.objects.none()
        return ChatRoom.objects.filter(participants=user).order_by('-updated_at')

class MessageViewSet(viewsets.ModelViewSet):
    """
    API for retrieving message history for a specific room.
    Messages are primarily sent via WebSockets, but REST API serves history.
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['room']

    def get_queryset(self):
        user = self.request.user
        if getattr(self, 'swagger_fake_view', False):
            return Message.objects.none()
        # Only return messages for rooms the user is in
        return Message.objects.filter(room__participants=user).order_by('created_at')

    def perform_create(self, serializer):
        room = serializer.validated_data['room']
        if self.request.user not in room.participants.all():
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You are not a participant of this chat room.")
        
        serializer.save(sender=self.request.user)
        # Update room's updated_at timestamp
        room.save()

    @action(detail=False, methods=['post'], url_path='mark-read')
    def mark_read(self, request):
        room_id = request.data.get('room_id')
        if not room_id:
            return Response({"error": "room_id required"}, status=status.HTTP_400_BAD_REQUEST)
            
        messages = Message.objects.filter(
            room_id=room_id, 
            room__participants=request.user,
            is_read=False
        ).exclude(sender=request.user)
        
        updated_count = messages.update(is_read=True)
        return Response({"status": "marked as read", "count": updated_count})

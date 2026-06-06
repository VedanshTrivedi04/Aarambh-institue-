from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    """
    Users can fetch their notifications and mark them as read.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['is_read', 'notification_type']

    def get_queryset(self):
        user = self.request.user
        if getattr(self, 'swagger_fake_view', False):
            return Notification.objects.none()
        return Notification.objects.filter(recipient=user).order_by('-created_at')

    @action(detail=False, methods=['post'], url_path='mark-read')
    def mark_read(self, request):
        notification_ids = request.data.get('ids', [])
        if not notification_ids:
            # If no IDs provided, mark all as read
            count = self.get_queryset().filter(is_read=False).update(is_read=True)
        else:
            count = self.get_queryset().filter(id__in=notification_ids, is_read=False).update(is_read=True)
            
        return Response({"status": "marked as read", "count": count})

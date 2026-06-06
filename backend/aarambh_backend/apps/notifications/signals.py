import json
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from .models import Notification
from apps.announcements.models import Announcement
from apps.performance.models import Score

@receiver(post_save, sender=Notification)
def broadcast_notification(sender, instance, created, **kwargs):
    """
    When a Notification is saved, push it via WebSocket to the user's specific group.
    """
    if created:
        channel_layer = get_channel_layer()
        group_name = f"user_notifications_{instance.recipient.id}"
        
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "send_notification",
                "notification": {
                    "id": str(instance.id),
                    "title": instance.title,
                    "message": instance.message,
                    "type": instance.notification_type,
                    "created_at": instance.created_at.isoformat()
                }
            }
        )

# Signal: When a GLOBAL Announcement is created, notify all active users
@receiver(post_save, sender=Announcement)
def create_announcement_notification(sender, instance, created, **kwargs):
    if created and instance.is_global:
        from apps.users.models import CustomUser
        users = CustomUser.objects.filter(is_active=True)
        notifications = [
            Notification(
                recipient=user,
                title=f"New Announcement: {instance.title}",
                message=instance.content[:100],
                notification_type="announcement"
            ) for user in users
        ]
        Notification.objects.bulk_create(notifications)

# Signal: When target_batches M2M is set, notify enrolled students
@receiver(m2m_changed, sender=Announcement.target_batches.through)
def create_batch_announcement_notification(sender, instance, action, pk_set, **kwargs):
    if action == "post_add" and pk_set:
        from apps.academics.models import BatchEnrollment, Batch
        batches = Batch.objects.filter(pk__in=pk_set)
        for batch in batches:
            enrollments = BatchEnrollment.objects.filter(
                batch=batch, status='active'
            ).select_related('student')
            notifications = [
                Notification(
                    recipient=en.student,
                    title=f"Announcement for {batch.name}: {instance.title}",
                    message=instance.content[:100],
                    notification_type="announcement"
                ) for en in enrollments
            ]
            Notification.objects.bulk_create(notifications)

# Note: bulk_create does not trigger individual post_save signals.
# For real-time push per-notification, iterate and .save() instead.

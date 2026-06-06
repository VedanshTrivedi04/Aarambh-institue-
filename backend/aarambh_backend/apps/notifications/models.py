import uuid
from django.db import models
from apps.users.models import CustomUser

class Notification(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient       = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notifications")
    title           = models.CharField(max_length=200)
    message         = models.TextField()
    notification_type = models.CharField(max_length=50, choices=[
        ("announcement", "Announcement"),
        ("fee_due", "Fee Due"),
        ("test_score", "Test Score"),
        ("system", "System Alert")
    ], default="system")
    is_read         = models.BooleanField(default=False)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notifications_notification"
        ordering = ["-created_at"]

    def __str__(self):
        return f"To {self.recipient.email}: {self.title}"

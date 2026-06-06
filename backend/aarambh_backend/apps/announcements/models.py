import uuid
from django.db import models
from apps.users.models import CustomUser
from apps.academics.models import Batch
from utils.mixins import SoftDeleteModelMixin
from utils.storage import get_upload_path

class Announcement(SoftDeleteModelMixin):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title           = models.CharField(max_length=255)
    content         = models.TextField()
    attachment      = models.FileField(upload_to=get_upload_path, null=True, blank=True)
    author          = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, limit_choices_to={"role__in": ["teacher", "admin"]})
    is_global       = models.BooleanField(default=False, help_text="If True, visible to everyone. If False, only to selected batches.")
    target_batches  = models.ManyToManyField(Batch, blank=True, related_name="announcements")
    priority        = models.CharField(max_length=20, choices=[("low","Low"), ("normal","Normal"), ("high","High"), ("urgent","Urgent")], default="normal")
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "announcements_announcement"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["is_global", "created_at"]),
            models.Index(fields=["priority"])
        ]
        
    def __str__(self):
        return self.title

class AnnouncementReadReceipt(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    announcement    = models.ForeignKey(Announcement, on_delete=models.CASCADE, related_name="read_receipts")
    user            = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="read_announcements")
    read_at         = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "announcements_readreceipt"
        unique_together = [("announcement", "user")]
        
    def __str__(self):
        return f"{self.user} read {self.announcement}"

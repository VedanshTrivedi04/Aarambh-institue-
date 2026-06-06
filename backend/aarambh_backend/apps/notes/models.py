import uuid
from django.db import models
from apps.users.models import CustomUser
from apps.academics.models import Batch, Subject
from utils.mixins import SoftDeleteModelMixin
from utils.storage import get_upload_path

class Note(SoftDeleteModelMixin):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title           = models.CharField(max_length=255)
    description     = models.TextField(null=True, blank=True)
    file            = models.FileField(upload_to=get_upload_path)
    file_type       = models.CharField(max_length=20, choices=[("pdf","PDF"), ("video","Video"), ("image","Image"), ("other","Other")])
    uploaded_by     = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, limit_choices_to={"role__in": ["teacher", "admin"]})
    subject         = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="notes")
    batches         = models.ManyToManyField(Batch, related_name="notes")
    is_published    = models.BooleanField(default=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "notes_note"
        indexes = [
            models.Index(fields=["is_published", "created_at"])
        ]
        
    def __str__(self):
        return self.title

import uuid
from django.db import models
from utils.mixins import SoftDeleteModelMixin
from apps.users.models import CustomUser

class Subject(SoftDeleteModelMixin):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name        = models.CharField(max_length=100) # e.g. "Physics", "Chemistry"
    code        = models.CharField(max_length=20, unique=True)
    description = models.TextField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "academics_subject"
        
    def __str__(self):
        return self.name

class Batch(SoftDeleteModelMixin):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name                = models.CharField(max_length=150) # "Dropper JEE 2026", "11th Foundation CBSE"
    class_grade         = models.CharField(max_length=10, choices=[("10","10th"),("11","11th"),("12","12th"), ("dropper", "Dropper")])
    target_exam         = models.CharField(max_length=20, choices=[("jee","JEE"), ("neet","NEET"), ("boards","Boards")])
    start_date          = models.DateField()
    end_date            = models.DateField(null=True, blank=True)
    status              = models.CharField(max_length=20, choices=[("upcoming","Upcoming"), ("active","Active"), ("completed","Completed")], default="active")
    max_capacity        = models.PositiveIntegerField(default=50)
    current_strength    = models.PositiveIntegerField(default=0)
    subjects            = models.ManyToManyField(Subject, related_name="batches")
    primary_teachers    = models.ManyToManyField(CustomUser, limit_choices_to={"role": "teacher"}, related_name="managed_batches")
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "academics_batch"
        indexes = [
            models.Index(fields=["status", "target_exam"])
        ]
        
    def __str__(self):
        return self.name

class BatchEnrollment(SoftDeleteModelMixin):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student             = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={"role": "student"}, related_name="enrollments")
    batch               = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name="enrollments")
    status              = models.CharField(max_length=20, choices=[("active","Active"), ("suspended","Suspended"), ("completed","Completed"), ("dropped","Dropped")], default="active")
    enrolled_at         = models.DateTimeField(auto_now_add=True)
    last_updated        = models.DateTimeField(auto_now=True)
    notes               = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "academics_batchenrollment"
        unique_together = [("student", "batch")]
        indexes = [
            models.Index(fields=["student", "status"]),
            models.Index(fields=["batch", "status"])
        ]
        
    def __str__(self):
        return f"{self.student.first_name} -> {self.batch.name}"

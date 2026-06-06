import uuid
from django.db import models
from apps.users.models import CustomUser

class Enquiry(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_name    = models.CharField(max_length=150)
    parent_name     = models.CharField(max_length=150, null=True, blank=True)
    phone_number    = models.CharField(max_length=15)
    email           = models.EmailField(null=True, blank=True)
    target_exam     = models.CharField(max_length=50) # e.g. "JEE 2026", "NEET"
    current_class   = models.CharField(max_length=20) # e.g. "11th", "12th", "Dropper"
    previous_score  = models.CharField(max_length=100, null=True, blank=True)
    status          = models.CharField(max_length=20, choices=[
        ("new", "New"), 
        ("contacted", "Contacted"), 
        ("demo_scheduled", "Demo Scheduled"), 
        ("converted", "Converted"), 
        ("lost", "Lost")
    ], default="new")
    source          = models.CharField(max_length=50, null=True, blank=True, help_text="e.g. Website, Walk-in, Referral")
    notes           = models.TextField(null=True, blank=True)
    assigned_to     = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={"role__in": ["admin", "teacher"]}, related_name="assigned_enquiries")
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "enquiries_enquiry"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.student_name} - {self.target_exam} ({self.status})"

class FollowUp(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enquiry         = models.ForeignKey(Enquiry, on_delete=models.CASCADE, related_name="follow_ups")
    handled_by      = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, limit_choices_to={"role__in": ["admin", "teacher"]})
    date            = models.DateTimeField()
    method          = models.CharField(max_length=20, choices=[("call", "Call"), ("email", "Email"), ("whatsapp", "WhatsApp"), ("in_person", "In Person")])
    summary         = models.TextField()
    next_follow_up  = models.DateTimeField(null=True, blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "enquiries_followup"
        ordering = ["-date"]

    def __str__(self):
        return f"{self.method} for {self.enquiry.student_name} on {self.date.date()}"

import uuid
from django.db import models
from apps.users.models import CustomUser
from apps.academics.models import Batch, Subject

class AttendanceSession(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    batch           = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name="attendance_sessions")
    date            = models.DateField()
    marked_by       = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, limit_choices_to={"role__in": ["teacher", "admin"]})
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "performance_attendancesession"
        unique_together = [("batch", "date")]

    def __str__(self):
        return f"{self.batch.name} - {self.date}"

class AttendanceRecord(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session         = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE, related_name="records")
    student         = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={"role": "student"})
    status          = models.CharField(max_length=15, choices=[("present","Present"), ("absent","Absent"), ("late","Late"), ("excused","Excused")])
    remarks         = models.CharField(max_length=200, null=True, blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "performance_attendancerecord"
        unique_together = [("session", "student")]

    def __str__(self):
        return f"{self.student.first_name} - {self.status}"

class Test(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    batch           = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name="tests")
    subject         = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="tests")
    title           = models.CharField(max_length=200)
    date            = models.DateField()
    max_marks       = models.DecimalField(max_digits=6, decimal_places=2)
    syllabus        = models.TextField(null=True, blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "performance_test"

    def __str__(self):
        return f"{self.title} - {self.batch.name}"

class Score(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    test            = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="scores")
    student         = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={"role": "student"}, related_name="scores")
    marks_obtained  = models.DecimalField(max_digits=6, decimal_places=2)
    rank            = models.PositiveIntegerField(null=True, blank=True)
    remarks         = models.CharField(max_length=200, null=True, blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "performance_score"
        unique_together = [("test", "student")]

    def __str__(self):
        return f"{self.student.first_name}: {self.marks_obtained}/{self.test.max_marks}"

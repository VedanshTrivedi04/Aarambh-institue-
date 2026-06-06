import uuid
from django.db import models
from apps.users.models import CustomUser
from apps.academics.models import Batch

class FeeStructure(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    batch           = models.ForeignKey(Batch, on_delete=models.CASCADE, related_name="fee_structures")
    title           = models.CharField(max_length=150)
    amount          = models.DecimalField(max_digits=10, decimal_places=2)
    due_date        = models.DateField()
    description     = models.TextField(null=True, blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "fees_feestructure"
        ordering = ["due_date"]

    def __str__(self):
        return f"{self.title} for {self.batch.name} - {self.amount}"

class StudentFee(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student         = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'student'}, related_name="fees")
    fee_structure   = models.ForeignKey(FeeStructure, on_delete=models.CASCADE, related_name="student_fees")
    discount        = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_fully_paid   = models.BooleanField(default=False)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "fees_studentfee"
        unique_together = ("student", "fee_structure")

    def __str__(self):
        return f"{self.student.email} - {self.fee_structure.title}"
        
    @property
    def total_payable(self):
        return self.fee_structure.amount - self.discount

    @property
    def total_paid(self):
        return sum(payment.amount for payment in self.payments.filter(status='completed'))

    @property
    def remaining_balance(self):
        return self.total_payable - self.total_paid

class Payment(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_fee     = models.ForeignKey(StudentFee, on_delete=models.CASCADE, related_name="payments")
    amount          = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date    = models.DateTimeField(auto_now_add=True)
    payment_method  = models.CharField(max_length=50, choices=[
        ("cash", "Cash"),
        ("card", "Credit/Debit Card"),
        ("upi", "UPI"),
        ("bank_transfer", "Bank Transfer"),
        ("cheque", "Cheque")
    ])
    transaction_id  = models.CharField(max_length=150, null=True, blank=True)
    status          = models.CharField(max_length=20, choices=[
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed")
    ], default="completed")
    remarks         = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "fees_payment"
        ordering = ["-payment_date"]

    def __str__(self):
        return f"{self.amount} for {self.student_fee} ({self.status})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Automatically update the parent StudentFee's is_fully_paid status
        if self.status == 'completed':
            sf = self.student_fee
            if sf.remaining_balance <= 0:
                sf.is_fully_paid = True
                sf.save(update_fields=['is_fully_paid'])

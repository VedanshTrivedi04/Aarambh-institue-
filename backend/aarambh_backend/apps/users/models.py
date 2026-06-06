import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, phone, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        if not phone:
            raise ValueError('The Phone field must be set')
        
        email = self.normalize_email(email)
        user = self.model(email=email, phone=phone, **extra_fields)
        
        # In a real system, you'd likely want to enforce password strength here
        # or during the view/serializer logic.
        if password:
             user.set_password(password)
        else:
             user.set_unusable_password()
             
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, phone, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email               = models.EmailField(unique=True, db_index=True)
    phone               = models.CharField(max_length=15, unique=True, db_index=True)
    username            = models.CharField(max_length=50, unique=True, null=True, blank=True)
    first_name          = models.CharField(max_length=100)
    last_name           = models.CharField(max_length=100)
    role                = models.CharField(max_length=20, choices=[
                            ("student","Student"), ("teacher","Teacher"),
                            ("parent","Parent"), ("admin","Admin")
                          ], db_index=True)
    profile_photo       = models.ImageField(upload_to="profiles/%Y/%m/", null=True, blank=True)
    is_active           = models.BooleanField(default=True, db_index=True)
    is_staff            = models.BooleanField(default=False)
    is_superuser        = models.BooleanField(default=False)
    date_joined         = models.DateTimeField(auto_now_add=True)
    last_login          = models.DateTimeField(null=True, blank=True)
    last_seen_at        = models.DateTimeField(null=True, blank=True)
    is_online           = models.BooleanField(default=False)
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["phone", "first_name", "last_name", "role"]

    class Meta:
        db_table = "users_customuser"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["role", "is_active"]),
            models.Index(fields=["email", "role"]),
        ]
        
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"


class StudentProfile(models.Model):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user                = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="student_profile")
    roll_number         = models.CharField(max_length=20, unique=True, null=True, blank=True)
    admission_number    = models.CharField(max_length=30, unique=True, null=True, blank=True)
    class_grade         = models.CharField(max_length=5, choices=[("10","10th"),("11","11th"),("12","12th")])
    board               = models.CharField(max_length=20, choices=[
                            ("mp_board","MP Board"), ("cbse","CBSE"), ("icse","ICSE")
                          ])
    stream              = models.CharField(max_length=20, choices=[
                            ("science","Science"), ("commerce","Commerce"),
                            ("arts","Arts"), ("all","All Subjects")
                          ], null=True, blank=True)
    date_of_birth       = models.DateField(null=True, blank=True)
    address_line1       = models.CharField(max_length=255, null=True, blank=True)
    address_city        = models.CharField(max_length=100, null=True, blank=True)
    address_state       = models.CharField(max_length=100, default="Madhya Pradesh")
    address_pincode     = models.CharField(max_length=10, null=True, blank=True)
    parent_name         = models.CharField(max_length=150, null=True, blank=True)
    parent_phone        = models.CharField(max_length=15, null=True, blank=True)
    parent_email        = models.EmailField(null=True, blank=True)
    emergency_phone     = models.CharField(max_length=15, null=True, blank=True)
    enrollment_date     = models.DateField(auto_now_add=True)
    previous_school     = models.CharField(max_length=200, null=True, blank=True)
    previous_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    notes               = models.TextField(null=True, blank=True)  # admin internal notes
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "users_studentprofile"
        
    def __str__(self):
        return f"StudentProfile({self.user.email})"


class TeacherProfile(models.Model):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user                = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="teacher_profile")
    employee_id         = models.CharField(max_length=20, unique=True, null=True, blank=True)
    qualification       = models.CharField(max_length=200)       # "M.Sc Physics, IIT Bombay"
    experience_years    = models.PositiveIntegerField(default=0)
    bio                 = models.TextField(null=True, blank=True)
    achievement         = models.CharField(max_length=300, null=True, blank=True)  # "500+ students scored 95%+"
    specialization      = models.CharField(max_length=200, null=True, blank=True)
    rating              = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)  # calculated avg
    rating_count        = models.PositiveIntegerField(default=0)
    joining_date        = models.DateField(null=True, blank=True)
    salary_amount       = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active_teacher   = models.BooleanField(default=True)
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "users_teacherprofile"
        
    def __str__(self):
         return f"TeacherProfile({self.user.email})"


class ParentProfile(models.Model):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user                = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="parent_profile")
    occupation          = models.CharField(max_length=100, null=True, blank=True)
    relationship        = models.CharField(max_length=20, choices=[
                            ("father","Father"), ("mother","Mother"), ("guardian","Guardian")
                          ], default="father")
    alternate_phone     = models.CharField(max_length=15, null=True, blank=True)
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "users_parentprofile"
        
    def __str__(self):
         return f"ParentProfile({self.user.email})"


class AdminProfile(models.Model):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user                = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="admin_profile")
    admin_level         = models.CharField(max_length=20, choices=[
                            ("super_admin","Super Admin"), ("staff_admin","Staff Admin")
                          ], default="staff_admin")
    department          = models.CharField(max_length=100, null=True, blank=True)
    can_manage_fees     = models.BooleanField(default=False)
    can_delete_content  = models.BooleanField(default=False)
    can_manage_users    = models.BooleanField(default=True)
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "users_adminprofile"
        
    def __str__(self):
         return f"AdminProfile({self.user.email})"


class ParentStudentLink(models.Model):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent              = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="linked_students",
                            limit_choices_to={"role": "parent"})
    student             = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="linked_parents",
                            limit_choices_to={"role": "student"})
    is_primary          = models.BooleanField(default=True)
    created_at          = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "users_parentstudentlink"
        unique_together = [("parent", "student")]
        
    def __str__(self):
        return f"{self.parent} -> {self.student}"


class OTPRecord(models.Model):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone               = models.CharField(max_length=15, db_index=True)
    otp_hash            = models.CharField(max_length=128)        # bcrypt hash of OTP
    purpose             = models.CharField(max_length=30, choices=[
                            ("login","Login"), ("password_reset","Password Reset"),
                            ("phone_verify","Phone Verify")
                          ])
    is_used             = models.BooleanField(default=False)
    attempt_count       = models.PositiveSmallIntegerField(default=0)
    max_attempts        = models.PositiveSmallIntegerField(default=3)
    expires_at          = models.DateTimeField()                  # now + 10 min
    used_at             = models.DateTimeField(null=True, blank=True)
    created_at          = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "users_otprecord"
        indexes = [models.Index(fields=["phone", "purpose", "is_used"])]
        
    def __str__(self):
         return f"OTPRecord({self.phone}, {self.purpose})"


class PasswordResetToken(models.Model):
    id                  = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user                = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="reset_tokens")
    token_hash          = models.CharField(max_length=128, unique=True)
    is_used             = models.BooleanField(default=False)
    expires_at          = models.DateTimeField()                  # now + 1 hour
    used_at             = models.DateTimeField(null=True, blank=True)
    ip_address          = models.GenericIPAddressField(null=True, blank=True)
    created_at          = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "users_passwordresettoken"
        
    def __str__(self):
        return f"PasswordResetToken({self.user.email})"

# Aarambh Institute — Backend Agent Handover File
## Phase-by-Phase Implementation + Complete Database Schema

---

## 🧠 CONTEXT FOR NEW AGENT

You are taking over backend development for **Aarambh Institute** — a JEE/NEET coaching platform in Bhopal. The frontend is already built in React + Vite + TypeScript. Your job is to build the complete backend API.

**Read these files first (in order):**
1. `SKILL.md` — coding conventions, patterns, folder structure
2. `SUPERPOWER.md` — what you can do and how
3. This file — what to build, in what order, exact DB schema

**Frontend codebase:** React 18, Vite, Tailwind v4, react-router v7
**Frontend roles:** student | teacher | parent | admin
**Frontend data needs:** From `ContactSection`, `FacultySection`, `AchievementsSection`, `Testimonials`, `CoursesSection`, `LoginPage`

---

## 📦 COMPLETE REQUIREMENTS.TXT

```
# Core
Django==5.1.4
djangorestframework==3.15.2
django-cors-headers==4.6.0

# Auth
djangorestframework-simplejwt==5.3.1

# Database
psycopg2-binary==2.9.10
django-extensions==3.2.3

# Real-time
channels==4.1.0
channels-redis==4.2.0
daphne==4.1.2

# API Docs
drf-spectacular==0.27.2

# Filtering
django-filter==24.3

# File handling
Pillow==11.0.0
python-magic==0.4.27

# Environment
python-decouple==3.8

# Task queue
celery==5.4.0
redis==5.2.1

# SMS (pluggable)
twilio==9.4.2

# Storage (S3 for production)
django-storages==1.14.4
boto3==1.35.76

# Utilities
djangorestframework-camel-case==1.4.2

# Dev only (requirements-dev.txt)
pytest==8.3.4
pytest-django==4.9.0
factory-boy==3.3.1
faker==33.1.0
black==24.10.0
ruff==0.8.2
```

---

## 🗄️ COMPLETE DATABASE SCHEMA

> Every table has UUID primary key. All fields documented. Copy this exactly into your models.

---

### APP: users

#### Table: `users_customuser`
```python
class CustomUser(AbstractBaseUser, PermissionsMixin):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    email               = EmailField(unique=True, db_index=True)
    phone               = CharField(max_length=15, unique=True, db_index=True)
    username            = CharField(max_length=50, unique=True, null=True, blank=True)
    first_name          = CharField(max_length=100)
    last_name           = CharField(max_length=100)
    role                = CharField(max_length=20, choices=[
                            ("student","Student"), ("teacher","Teacher"),
                            ("parent","Parent"), ("admin","Admin")
                          ], db_index=True)
    profile_photo       = ImageField(upload_to="profiles/%Y/%m/", null=True, blank=True)
    is_active           = BooleanField(default=True, db_index=True)
    is_staff            = BooleanField(default=False)
    is_superuser        = BooleanField(default=False)
    date_joined         = DateTimeField(auto_now_add=True)
    last_login          = DateTimeField(null=True, blank=True)
    last_seen_at        = DateTimeField(null=True, blank=True)
    is_online           = BooleanField(default=False)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["phone", "first_name", "last_name", "role"]

    class Meta:
        db_table = "users_customuser"
        ordering = ["-created_at"]
        indexes = [
            Index(fields=["role", "is_active"]),
            Index(fields=["email", "role"]),
        ]
```

#### Table: `users_studentprofile`
```python
class StudentProfile(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    user                = OneToOneField(CustomUser, on_delete=CASCADE, related_name="student_profile")
    roll_number         = CharField(max_length=20, unique=True, null=True, blank=True)
    admission_number    = CharField(max_length=30, unique=True, null=True, blank=True)
    class_grade         = CharField(max_length=5, choices=[("10","10th"),("11","11th"),("12","12th")])
    board               = CharField(max_length=20, choices=[
                            ("mp_board","MP Board"), ("cbse","CBSE"), ("icse","ICSE")
                          ])
    stream              = CharField(max_length=20, choices=[
                            ("science","Science"), ("commerce","Commerce"),
                            ("arts","Arts"), ("all","All Subjects")
                          ], null=True, blank=True)
    date_of_birth       = DateField(null=True, blank=True)
    address_line1       = CharField(max_length=255, null=True, blank=True)
    address_city        = CharField(max_length=100, null=True, blank=True)
    address_state       = CharField(max_length=100, default="Madhya Pradesh")
    address_pincode     = CharField(max_length=10, null=True, blank=True)
    parent_name         = CharField(max_length=150, null=True, blank=True)
    parent_phone        = CharField(max_length=15, null=True, blank=True)
    parent_email        = EmailField(null=True, blank=True)
    emergency_phone     = CharField(max_length=15, null=True, blank=True)
    enrollment_date     = DateField(auto_now_add=True)
    previous_school     = CharField(max_length=200, null=True, blank=True)
    previous_percentage = DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    notes               = TextField(null=True, blank=True)  # admin internal notes
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "users_studentprofile"
```

#### Table: `users_teacherprofile`
```python
class TeacherProfile(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    user                = OneToOneField(CustomUser, on_delete=CASCADE, related_name="teacher_profile")
    employee_id         = CharField(max_length=20, unique=True, null=True, blank=True)
    qualification       = CharField(max_length=200)       # "M.Sc Physics, IIT Bombay"
    experience_years    = PositiveIntegerField(default=0)
    bio                 = TextField(null=True, blank=True)
    achievement         = CharField(max_length=300, null=True, blank=True)  # "500+ students scored 95%+"
    specialization      = CharField(max_length=200, null=True, blank=True)
    rating              = DecimalField(max_digits=3, decimal_places=1, default=5.0)  # calculated avg
    rating_count        = PositiveIntegerField(default=0)
    joining_date        = DateField(null=True, blank=True)
    salary_amount       = DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_active_teacher   = BooleanField(default=True)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "users_teacherprofile"
```

#### Table: `users_parentprofile`
```python
class ParentProfile(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    user                = OneToOneField(CustomUser, on_delete=CASCADE, related_name="parent_profile")
    occupation          = CharField(max_length=100, null=True, blank=True)
    relationship        = CharField(max_length=20, choices=[
                            ("father","Father"), ("mother","Mother"), ("guardian","Guardian")
                          ], default="father")
    alternate_phone     = CharField(max_length=15, null=True, blank=True)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "users_parentprofile"
```

#### Table: `users_adminprofile`
```python
class AdminProfile(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    user                = OneToOneField(CustomUser, on_delete=CASCADE, related_name="admin_profile")
    admin_level         = CharField(max_length=20, choices=[
                            ("super_admin","Super Admin"), ("staff_admin","Staff Admin")
                          ], default="staff_admin")
    department          = CharField(max_length=100, null=True, blank=True)
    can_manage_fees     = BooleanField(default=False)
    can_delete_content  = BooleanField(default=False)
    can_manage_users    = BooleanField(default=True)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "users_adminprofile"
```

#### Table: `users_parentstudentlink`
```python
class ParentStudentLink(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    parent              = ForeignKey(CustomUser, on_delete=CASCADE, related_name="linked_students",
                            limit_choices_to={"role": "parent"})
    student             = ForeignKey(CustomUser, on_delete=CASCADE, related_name="linked_parents",
                            limit_choices_to={"role": "student"})
    is_primary          = BooleanField(default=True)
    created_at          = DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "users_parentstudentlink"
        unique_together = [("parent", "student")]
```

#### Table: `users_otprecord`
```python
class OTPRecord(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    phone               = CharField(max_length=15, db_index=True)
    otp_hash            = CharField(max_length=128)        # bcrypt hash of OTP
    purpose             = CharField(max_length=30, choices=[
                            ("login","Login"), ("password_reset","Password Reset"),
                            ("phone_verify","Phone Verify")
                          ])
    is_used             = BooleanField(default=False)
    attempt_count       = PositiveSmallIntegerField(default=0)
    max_attempts        = PositiveSmallIntegerField(default=3)
    expires_at          = DateTimeField()                  # now + 10 min
    used_at             = DateTimeField(null=True, blank=True)
    created_at          = DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "users_otprecord"
        indexes = [Index(fields=["phone", "purpose", "is_used"])]
```

#### Table: `users_passwordresettoken`
```python
class PasswordResetToken(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    user                = ForeignKey(CustomUser, on_delete=CASCADE, related_name="reset_tokens")
    token_hash          = CharField(max_length=128, unique=True)
    is_used             = BooleanField(default=False)
    expires_at          = DateTimeField()                  # now + 1 hour
    used_at             = DateTimeField(null=True, blank=True)
    ip_address          = GenericIPAddressField(null=True, blank=True)
    created_at          = DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "users_passwordresettoken"
```

---

### APP: academics

#### Table: `academics_subject`
```python
class Subject(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    name                = CharField(max_length=100)        # "Physics"
    code                = CharField(max_length=10, unique=True)  # "PHY"
    description         = TextField(null=True, blank=True)
    icon_name           = CharField(max_length=50, default="BookOpen")  # lucide icon name
    applicable_classes  = JSONField(default=list)          # [10, 11, 12]
    applicable_boards   = JSONField(default=list)          # ["mp_board", "cbse", "icse"]
    color_hex           = CharField(max_length=7, default="#3B5BDB")
    display_order       = PositiveSmallIntegerField(default=0)
    is_active           = BooleanField(default=True, db_index=True)
    created_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "academics_subject"
        ordering = ["display_order", "name"]
```

#### Table: `academics_batch`
```python
class Batch(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    name                = CharField(max_length=100)        # "JEE-2026-Batch-A"
    batch_code          = CharField(max_length=20, unique=True)  # "JEE26A"
    description         = TextField(null=True, blank=True)
    class_grade         = CharField(max_length=5, choices=[("10","10th"),("11","11th"),("12","12th")])
    board               = CharField(max_length=20, choices=[
                            ("mp_board","MP Board"), ("cbse","CBSE"),
                            ("icse","ICSE"), ("all","All Boards")
                          ])
    stream              = CharField(max_length=20, choices=[
                            ("science","Science"), ("commerce","Commerce"),
                            ("arts","Arts"), ("all","All Streams")
                          ], default="all")
    batch_type          = CharField(max_length=20, choices=[
                            ("regular","Regular"), ("crash","Crash Course"),
                            ("weekend","Weekend"), ("online","Online")
                          ], default="regular")
    max_students        = PositiveSmallIntegerField(default=25)
    current_students    = PositiveSmallIntegerField(default=0)  # cached count
    schedule_days       = JSONField(default=list)          # ["Mon", "Wed", "Fri"]
    schedule_time_start = TimeField(null=True, blank=True)
    schedule_time_end   = TimeField(null=True, blank=True)
    start_date          = DateField()
    end_date            = DateField(null=True, blank=True)
    fee_amount          = DecimalField(max_digits=10, decimal_places=2, default=0)
    fee_type            = CharField(max_length=20, choices=[
                            ("monthly","Monthly"), ("quarterly","Quarterly"),
                            ("annual","Annual"), ("one_time","One Time")
                          ], default="monthly")
    status              = CharField(max_length=20, choices=[
                            ("upcoming","Upcoming"), ("active","Active"),
                            ("completed","Completed"), ("cancelled","Cancelled")
                          ], default="upcoming", db_index=True)
    room_number         = CharField(max_length=20, null=True, blank=True)
    notes               = TextField(null=True, blank=True)
    created_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True, related_name="created_batches")
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "academics_batch"
        ordering = ["-start_date"]
        indexes = [
            Index(fields=["status", "class_grade"]),
            Index(fields=["board", "stream"]),
        ]
```

#### Table: `academics_batchteachersubject`
```python
class BatchTeacherSubject(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    batch               = ForeignKey(Batch, on_delete=CASCADE, related_name="teacher_assignments")
    teacher             = ForeignKey(CustomUser, on_delete=CASCADE, related_name="batch_subjects",
                            limit_choices_to={"role": "teacher"})
    subject             = ForeignKey(Subject, on_delete=CASCADE, related_name="batch_assignments")
    is_primary          = BooleanField(default=True)
    assigned_date       = DateField(auto_now_add=True)
    removed_date        = DateField(null=True, blank=True)
    is_active           = BooleanField(default=True)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "academics_batchteachersubject"
        unique_together = [("batch", "teacher", "subject")]
        indexes = [Index(fields=["teacher", "is_active"])]
```

#### Table: `academics_studentbatchenrollment`
```python
class StudentBatchEnrollment(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    student             = ForeignKey(CustomUser, on_delete=CASCADE, related_name="enrollments",
                            limit_choices_to={"role": "student"})
    batch               = ForeignKey(Batch, on_delete=CASCADE, related_name="enrollments")
    enrollment_date     = DateField(auto_now_add=True)
    status              = CharField(max_length=20, choices=[
                            ("active","Active"), ("transferred","Transferred"),
                            ("completed","Completed"), ("dropped","Dropped"), ("on_hold","On Hold")
                          ], default="active", db_index=True)
    transfer_reason     = TextField(null=True, blank=True)
    transferred_from    = ForeignKey(Batch, on_delete=SET_NULL, null=True, blank=True, related_name="transferred_out")
    dropped_reason      = TextField(null=True, blank=True)
    completion_date     = DateField(null=True, blank=True)
    scholarship_percent = DecimalField(max_digits=5, decimal_places=2, default=0)
    enrolled_by         = ForeignKey(CustomUser, on_delete=SET_NULL, null=True, related_name="enrolled_students")
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "academics_studentbatchenrollment"
        indexes = [
            Index(fields=["student", "status"]),
            Index(fields=["batch", "status"]),
        ]
```

#### Table: `academics_bulkuploadlog`
```python
class BulkUploadLog(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    uploaded_by         = ForeignKey(CustomUser, on_delete=CASCADE)
    file_name           = CharField(max_length=255)
    total_rows          = PositiveIntegerField(default=0)
    successful_rows     = PositiveIntegerField(default=0)
    failed_rows         = PositiveIntegerField(default=0)
    status              = CharField(max_length=20, choices=[
                            ("processing","Processing"), ("completed","Completed"),
                            ("failed","Failed")
                          ], default="processing")
    error_report        = JSONField(default=list)          # [{row: 3, field: "phone", error: "..."}]
    created_at          = DateTimeField(auto_now_add=True)
    completed_at        = DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "academics_bulkuploadlog"
```

---

### APP: notes

#### Table: `notes_studymaterial`
```python
class StudyMaterial(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    title               = CharField(max_length=300)
    description         = TextField(null=True, blank=True)
    file                = FileField(upload_to="notes/%Y/%m/")     # UUID-named on save
    file_name           = CharField(max_length=255)                # original filename
    file_size           = BigIntegerField(default=0)               # bytes
    file_type           = CharField(max_length=20, choices=[
                            ("pdf","PDF"), ("docx","Word Document"), ("pptx","PowerPoint"),
                            ("video","Video"), ("image","Image"), ("other","Other")
                          ])
    mime_type           = CharField(max_length=100, null=True, blank=True)
    subject             = ForeignKey(Subject, on_delete=SET_NULL, null=True, related_name="materials")
    chapter_name        = CharField(max_length=200, null=True, blank=True)
    topic_name          = CharField(max_length=200, null=True, blank=True)
    tags                = JSONField(default=list)                  # ["integration", "calculus"]
    uploaded_by         = ForeignKey(CustomUser, on_delete=CASCADE, related_name="uploaded_materials",
                            limit_choices_to={"role__in": ["teacher", "admin"]})
    status              = CharField(max_length=20, choices=[
                            ("published","Published"), ("draft","Draft"), ("archived","Archived")
                          ], default="draft", db_index=True)
    scheduled_publish_at = DateTimeField(null=True, blank=True)
    total_downloads     = PositiveIntegerField(default=0)          # cached counter
    total_views         = PositiveIntegerField(default=0)
    is_deleted          = BooleanField(default=False, db_index=True)
    deleted_at          = DateTimeField(null=True, blank=True)
    deleted_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True, blank=True,
                            related_name="deleted_materials")
    created_at          = DateTimeField(auto_now_add=True, db_index=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "notes_studymaterial"
        ordering = ["-created_at"]
        indexes = [
            Index(fields=["status", "is_deleted"]),
            Index(fields=["uploaded_by", "status"]),
            Index(fields=["subject"]),
        ]
```

#### Table: `notes_studymaterialbatch`
```python
class StudyMaterialBatch(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    study_material      = ForeignKey(StudyMaterial, on_delete=CASCADE, related_name="batch_assignments")
    batch               = ForeignKey(Batch, on_delete=CASCADE, related_name="study_materials")
    assigned_at         = DateTimeField(auto_now_add=True)
    assigned_by         = ForeignKey(CustomUser, on_delete=SET_NULL, null=True)

    class Meta:
        db_table = "notes_studymaterialbatch"
        unique_together = [("study_material", "batch")]
```

#### Table: `notes_downloadlog`
```python
class DownloadLog(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    study_material      = ForeignKey(StudyMaterial, on_delete=CASCADE, related_name="downloads")
    student             = ForeignKey(CustomUser, on_delete=CASCADE, related_name="downloads",
                            limit_choices_to={"role": "student"})
    downloaded_at       = DateTimeField(auto_now_add=True, db_index=True)
    ip_address          = GenericIPAddressField(null=True, blank=True)
    device_info         = CharField(max_length=500, null=True, blank=True)  # user agent

    class Meta:
        db_table = "notes_downloadlog"
        indexes = [
            Index(fields=["study_material", "student"]),
            Index(fields=["student", "downloaded_at"]),
        ]
```

---

### APP: announcements

#### Table: `announcements_announcement`
```python
class Announcement(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    title               = CharField(max_length=300)
    message             = TextField()
    priority            = CharField(max_length=20, choices=[
                            ("normal","Normal"), ("important","Important"), ("urgent","Urgent")
                          ], default="normal", db_index=True)
    created_by          = ForeignKey(CustomUser, on_delete=CASCADE, related_name="announcements")
    target_type         = CharField(max_length=30, choices=[
                            ("all_students","All Students"), ("specific_batch","Specific Batch"),
                            ("my_students","My Students"), ("parents","All Parents"),
                            ("teachers","All Teachers")
                          ], default="my_students")
    is_pinned           = BooleanField(default=False)
    status              = CharField(max_length=20, choices=[
                            ("published","Published"), ("draft","Draft"), ("scheduled","Scheduled")
                          ], default="published", db_index=True)
    scheduled_at        = DateTimeField(null=True, blank=True)
    expires_at          = DateTimeField(null=True, blank=True)
    total_seen          = PositiveIntegerField(default=0)      # cached
    total_dismissed     = PositiveIntegerField(default=0)      # cached
    is_deleted          = BooleanField(default=False)
    created_at          = DateTimeField(auto_now_add=True, db_index=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "announcements_announcement"
        ordering = ["-is_pinned", "-created_at"]
        indexes = [
            Index(fields=["status", "is_deleted"]),
            Index(fields=["created_by", "status"]),
        ]
```

#### Table: `announcements_announcementbatch`
```python
class AnnouncementBatch(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    announcement        = ForeignKey(Announcement, on_delete=CASCADE, related_name="batch_targets")
    batch               = ForeignKey(Batch, on_delete=CASCADE, related_name="announcements")

    class Meta:
        db_table = "announcements_announcementbatch"
        unique_together = [("announcement", "batch")]
```

#### Table: `announcements_readreceipt`
```python
class AnnouncementReadReceipt(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    announcement        = ForeignKey(Announcement, on_delete=CASCADE, related_name="read_receipts")
    user                = ForeignKey(CustomUser, on_delete=CASCADE, related_name="announcement_reads")
    read_at             = DateTimeField(auto_now_add=True)
    is_dismissed        = BooleanField(default=False)
    dismissed_at        = DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "announcements_readreceipt"
        unique_together = [("announcement", "user")]
        indexes = [Index(fields=["announcement", "is_dismissed"])]
```

---

### APP: performance

#### Table: `performance_testscore`
```python
class TestScore(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    student             = ForeignKey(CustomUser, on_delete=CASCADE, related_name="test_scores",
                            limit_choices_to={"role": "student"})
    teacher             = ForeignKey(CustomUser, on_delete=SET_NULL, null=True, related_name="given_scores",
                            limit_choices_to={"role__in": ["teacher", "admin"]})
    batch               = ForeignKey(Batch, on_delete=CASCADE, related_name="test_scores")
    subject             = ForeignKey(Subject, on_delete=CASCADE, related_name="test_scores")
    test_name           = CharField(max_length=200)            # "Unit Test 3 - Laws of Motion"
    test_date           = DateField(db_index=True)
    chapter_name        = CharField(max_length=200, null=True, blank=True)
    topic_name          = CharField(max_length=200, null=True, blank=True)
    test_type           = CharField(max_length=30, choices=[
                            ("unit_test","Unit Test"), ("monthly_test","Monthly Test"),
                            ("mock_exam","Mock Exam"), ("pre_board","Pre Board"),
                            ("assignment","Assignment"), ("quiz","Quiz")
                          ], default="unit_test")
    score_obtained      = DecimalField(max_digits=7, decimal_places=2)
    max_score           = DecimalField(max_digits=7, decimal_places=2)
    percentage          = DecimalField(max_digits=5, decimal_places=2)   # calculated: (score/max)*100
    batch_rank          = PositiveSmallIntegerField(null=True, blank=True)   # calculated
    remarks             = TextField(null=True, blank=True)
    is_absent           = BooleanField(default=False)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "performance_testscore"
        ordering = ["-test_date"]
        indexes = [
            Index(fields=["student", "subject", "test_date"]),
            Index(fields=["batch", "test_date"]),
            Index(fields=["teacher", "test_date"]),
        ]
```

#### Table: `performance_attendancesession`
```python
class AttendanceSession(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    batch               = ForeignKey(Batch, on_delete=CASCADE, related_name="attendance_sessions")
    subject             = ForeignKey(Subject, on_delete=CASCADE, related_name="attendance_sessions")
    teacher             = ForeignKey(CustomUser, on_delete=SET_NULL, null=True,
                            limit_choices_to={"role": "teacher"})
    session_date        = DateField(db_index=True)
    start_time          = TimeField(null=True, blank=True)
    end_time            = TimeField(null=True, blank=True)
    topic_covered       = CharField(max_length=300, null=True, blank=True)
    total_students      = PositiveSmallIntegerField(default=0)
    present_count       = PositiveSmallIntegerField(default=0)
    absent_count        = PositiveSmallIntegerField(default=0)
    late_count          = PositiveSmallIntegerField(default=0)
    session_notes       = TextField(null=True, blank=True)
    created_at          = DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "performance_attendancesession"
        unique_together = [("batch", "subject", "session_date")]
        ordering = ["-session_date"]
```

#### Table: `performance_attendancerecord`
```python
class AttendanceRecord(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    session             = ForeignKey(AttendanceSession, on_delete=CASCADE, related_name="records")
    student             = ForeignKey(CustomUser, on_delete=CASCADE, related_name="attendance_records",
                            limit_choices_to={"role": "student"})
    status              = CharField(max_length=15, choices=[
                            ("present","Present"), ("absent","Absent"),
                            ("late","Late"), ("excused","Excused")
                          ], default="absent", db_index=True)
    marked_at           = DateTimeField(auto_now_add=True)
    remarks             = CharField(max_length=200, null=True, blank=True)

    class Meta:
        db_table = "performance_attendancerecord"
        unique_together = [("session", "student")]
        indexes = [Index(fields=["student", "status"])]
```

---

### APP: chat

#### Table: `chat_conversation`
```python
class Conversation(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    participant_1       = ForeignKey(CustomUser, on_delete=CASCADE, related_name="conversations_as_p1")
    participant_2       = ForeignKey(CustomUser, on_delete=CASCADE, related_name="conversations_as_p2")
    last_message_at     = DateTimeField(null=True, blank=True, db_index=True)
    last_message_preview = CharField(max_length=200, null=True, blank=True)
    unread_count_p1     = PositiveSmallIntegerField(default=0)   # unread count for participant_1
    unread_count_p2     = PositiveSmallIntegerField(default=0)
    is_active           = BooleanField(default=True)
    created_at          = DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "chat_conversation"
        ordering = ["-last_message_at"]
        indexes = [
            Index(fields=["participant_1", "last_message_at"]),
            Index(fields=["participant_2", "last_message_at"]),
        ]
```

#### Table: `chat_groupchat`
```python
class GroupChat(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    batch               = OneToOneField(Batch, on_delete=CASCADE, related_name="group_chat")
    name                = CharField(max_length=200)            # "JEE-2026-Batch-A Group"
    description         = TextField(null=True, blank=True)
    is_active           = BooleanField(default=True)
    allow_student_messages = BooleanField(default=True)
    created_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True)
    last_message_at     = DateTimeField(null=True, blank=True, db_index=True)
    last_message_preview = CharField(max_length=200, null=True, blank=True)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "chat_groupchat"
```

#### Table: `chat_groupmember`
```python
class GroupMember(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    group               = ForeignKey(GroupChat, on_delete=CASCADE, related_name="members")
    user                = ForeignKey(CustomUser, on_delete=CASCADE, related_name="group_memberships")
    role                = CharField(max_length=20, choices=[
                            ("admin","Admin"), ("teacher","Teacher"), ("member","Member")
                          ], default="member")
    is_muted            = BooleanField(default=False)
    muted_until         = DateTimeField(null=True, blank=True)
    joined_at           = DateTimeField(auto_now_add=True)
    left_at             = DateTimeField(null=True, blank=True)
    is_active           = BooleanField(default=True)

    class Meta:
        db_table = "chat_groupmember"
        unique_together = [("group", "user")]
        indexes = [Index(fields=["user", "is_active"])]
```

#### Table: `chat_message`
```python
class Message(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    conversation        = ForeignKey(Conversation, on_delete=CASCADE, null=True, blank=True,
                            related_name="messages")
    group               = ForeignKey(GroupChat, on_delete=CASCADE, null=True, blank=True,
                            related_name="messages")
    sender              = ForeignKey(CustomUser, on_delete=CASCADE, related_name="sent_messages")
    message_type        = CharField(max_length=20, choices=[
                            ("text","Text"), ("file","File"), ("image","Image"),
                            ("system","System"), ("announcement_ref","Announcement Ref")
                          ], default="text")
    content             = TextField(null=True, blank=True)
    file_attachment     = FileField(upload_to="chat_files/%Y/%m/", null=True, blank=True)
    file_name           = CharField(max_length=255, null=True, blank=True)
    file_size           = BigIntegerField(null=True, blank=True)
    file_mime_type      = CharField(max_length=100, null=True, blank=True)
    reply_to            = ForeignKey("self", on_delete=SET_NULL, null=True, blank=True,
                            related_name="replies")
    is_pinned           = BooleanField(default=False, db_index=True)
    is_deleted          = BooleanField(default=False, db_index=True)
    deleted_at          = DateTimeField(null=True, blank=True)
    deleted_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True, blank=True,
                            related_name="deleted_messages")
    created_at          = DateTimeField(auto_now_add=True, db_index=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "chat_message"
        ordering = ["created_at"]
        indexes = [
            Index(fields=["conversation", "created_at"]),
            Index(fields=["group", "created_at"]),
            Index(fields=["sender", "created_at"]),
        ]
```

#### Table: `chat_messagereadreceipt`
```python
class MessageReadReceipt(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    message             = ForeignKey(Message, on_delete=CASCADE, related_name="read_receipts")
    reader              = ForeignKey(CustomUser, on_delete=CASCADE, related_name="message_reads")
    read_at             = DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "chat_messagereadreceipt"
        unique_together = [("message", "reader")]
```

---

### APP: enquiries

#### Table: `enquiries_enquiry`
```python
class Enquiry(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    student_name        = CharField(max_length=150)
    phone               = CharField(max_length=15, db_index=True)
    email               = EmailField(null=True, blank=True)
    class_grade         = CharField(max_length=5, choices=[
                            ("10","10th"), ("11","11th"), ("12","12th")
                          ])
    board               = CharField(max_length=20, choices=[
                            ("mp_board","MP Board"), ("cbse","CBSE"), ("icse","ICSE")
                          ])
    stream              = CharField(max_length=20, null=True, blank=True)
    message             = TextField(null=True, blank=True)
    source              = CharField(max_length=30, choices=[
                            ("landing_page","Landing Page"), ("walk_in","Walk In"),
                            ("phone_call","Phone Call"), ("referral","Referral"),
                            ("social_media","Social Media"), ("other","Other")
                          ], default="landing_page")
    status              = CharField(max_length=30, choices=[
                            ("new","New"), ("contacted","Contacted"),
                            ("demo_scheduled","Demo Scheduled"), ("demo_done","Demo Done"),
                            ("enrolled","Enrolled"), ("not_interested","Not Interested"),
                            ("duplicate","Duplicate"), ("invalid","Invalid")
                          ], default="new", db_index=True)
    assigned_to         = ForeignKey(CustomUser, on_delete=SET_NULL, null=True, blank=True,
                            related_name="assigned_enquiries",
                            limit_choices_to={"role": "admin"})
    sms_sent            = BooleanField(default=False)
    sms_sent_at         = DateTimeField(null=True, blank=True)
    admin_note          = TextField(null=True, blank=True)         # internal note
    ip_address          = GenericIPAddressField(null=True, blank=True)
    is_duplicate        = BooleanField(default=False)
    created_at          = DateTimeField(auto_now_add=True, db_index=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "enquiries_enquiry"
        ordering = ["-created_at"]
        indexes = [
            Index(fields=["status", "created_at"]),
            Index(fields=["phone", "created_at"]),
        ]
```

#### Table: `enquiries_followuplog`
```python
class FollowUpLog(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    enquiry             = ForeignKey(Enquiry, on_delete=CASCADE, related_name="follow_up_logs")
    logged_by           = ForeignKey(CustomUser, on_delete=CASCADE, related_name="follow_up_logs")
    action_type         = CharField(max_length=30, choices=[
                            ("called","Called"), ("sms_sent","SMS Sent"),
                            ("demo_scheduled","Demo Scheduled"), ("demo_done","Demo Done"),
                            ("visited","Visited Office"), ("email_sent","Email Sent"),
                            ("status_changed","Status Changed"), ("note_added","Note Added"),
                            ("other","Other")
                          ])
    note                = TextField()
    old_status          = CharField(max_length=30, null=True, blank=True)
    new_status          = CharField(max_length=30, null=True, blank=True)
    next_followup_date  = DateField(null=True, blank=True)
    created_at          = DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "enquiries_followuplog"
        ordering = ["-created_at"]
```

---

### APP: content (Landing Page CMS)

#### Table: `content_heroconfig`
```python
class HeroConfig(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    institute_name      = CharField(max_length=100, default="Aarambh Institute")
    tagline             = CharField(max_length=200)
    sub_tagline         = CharField(max_length=200, null=True, blank=True)
    location_text       = CharField(max_length=200, default="Bhopal, Madhya Pradesh")
    admissions_open     = BooleanField(default=True)
    admissions_label    = CharField(max_length=50, default="Admissions Open")
    cta_primary_text    = CharField(max_length=100, default="Enroll Free Demo")
    cta_secondary_text  = CharField(max_length=100, default="Explore Courses")
    stat_1_value        = CharField(max_length=20, default="98.2%")
    stat_1_label        = CharField(max_length=50, default="Highest Score")
    stat_1_sub          = CharField(max_length=100, default="Ananya S. — 2024")
    stat_2_value        = CharField(max_length=20, default="5000+")
    stat_2_label        = CharField(max_length=50, default="Students")
    stat_2_sub          = CharField(max_length=100, default="Across all batches")
    stat_3_value        = CharField(max_length=20, default="15 Yrs")
    stat_3_label        = CharField(max_length=50, default="Experience")
    stat_3_sub          = CharField(max_length=100, default="Since 2010")
    is_active           = BooleanField(default=True)
    updated_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True)
    updated_at          = DateTimeField(auto_now=True)
    created_at          = DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "content_heroconfig"
```

#### Table: `content_achievementconfig`
```python
class AchievementConfig(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    students_coached    = PositiveIntegerField(default=5000)
    board_toppers       = PositiveIntegerField(default=150)
    score_improvement   = PositiveIntegerField(default=40)    # percentage
    years_of_excellence = PositiveIntegerField(default=15)
    hero_percentage     = CharField(max_length=20, default="98%+")
    hero_percentage_sub = CharField(max_length=100, default="Students reach their target score")
    batch_label         = CharField(max_length=50, default="2024 Batch")
    is_active           = BooleanField(default=True)
    updated_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True)
    updated_at          = DateTimeField(auto_now=True)
    created_at          = DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "content_achievementconfig"
```

#### Table: `content_facultymember`
```python
class FacultyMember(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    name                = CharField(max_length=150)
    subject             = CharField(max_length=100)
    classes_taught      = JSONField(default=list)             # ["10", "11", "12"]
    experience_years    = PositiveSmallIntegerField(default=0)
    qualification       = CharField(max_length=200)
    achievement         = CharField(max_length=300, null=True, blank=True)
    boards              = JSONField(default=list)             # ["MP Board", "CBSE"]
    photo_url           = CharField(max_length=500, null=True, blank=True)
    photo_file          = ImageField(upload_to="faculty/%Y/", null=True, blank=True)
    rating              = DecimalField(max_digits=3, decimal_places=1, default=5.0)
    accent_color        = CharField(max_length=7, default="#3B5BDB")
    display_order       = PositiveSmallIntegerField(default=0)
    is_active           = BooleanField(default=True, db_index=True)
    linked_user         = ForeignKey(CustomUser, on_delete=SET_NULL, null=True, blank=True,
                            related_name="faculty_profile_page")
    created_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True,
                            related_name="created_faculty")
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "content_facultymember"
        ordering = ["display_order", "name"]
```

#### Table: `content_topper`
```python
class Topper(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    name                = CharField(max_length=150)
    score_percentage    = CharField(max_length=10)            # "98.2%"
    board               = CharField(max_length=30)
    class_grade         = CharField(max_length=20)            # "XII Science"
    rank_label          = CharField(max_length=100)           # "State Topper"
    year                = PositiveSmallIntegerField()
    avatar_letter       = CharField(max_length=1)
    avatar_color        = CharField(max_length=7, default="#FF5C00")
    photo_url           = CharField(max_length=500, null=True, blank=True)
    photo_file          = ImageField(upload_to="toppers/%Y/", null=True, blank=True)
    display_order       = PositiveSmallIntegerField(default=0)
    is_active           = BooleanField(default=True, db_index=True)
    created_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "content_topper"
        ordering = ["-year", "display_order"]
```

#### Table: `content_testimonial`
```python
class Testimonial(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    name                = CharField(max_length=150)
    role                = CharField(max_length=200)           # "Parent · Ananya, Class 12 CBSE"
    quote_text          = TextField()
    score_shown         = CharField(max_length=20, null=True, blank=True)  # "98%"
    rating              = PositiveSmallIntegerField(default=5)
    avatar_letter       = CharField(max_length=1)
    avatar_color        = CharField(max_length=7, default="#3B5BDB")
    display_order       = PositiveSmallIntegerField(default=0)
    is_active           = BooleanField(default=True, db_index=True)
    created_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "content_testimonial"
        ordering = ["display_order"]
```

#### Table: `content_courseconfig`
```python
class CourseConfig(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    class_grade         = CharField(max_length=5, choices=[("10","10th"),("11","11th"),("12","12th")])
    emoji               = CharField(max_length=10, default="🎯")
    title               = CharField(max_length=100)           # "Class X"
    subtitle            = CharField(max_length=100)           # "Board Foundation"
    description         = TextField()
    tags                = JSONField(default=list)             # ["All Subjects", "Board Pattern"]
    accent_color        = CharField(max_length=7, default="#3B5BDB")
    bg_gradient         = CharField(max_length=100, default="from-blue-950 to-indigo-950")
    is_featured         = BooleanField(default=False)
    display_order       = PositiveSmallIntegerField(default=0)
    is_active           = BooleanField(default=True)
    updated_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True)
    updated_at          = DateTimeField(auto_now=True)
    created_at          = DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "content_courseconfig"
        ordering = ["display_order"]
```

#### Table: `content_galleryimage`
```python
class GalleryImage(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    image_file          = ImageField(upload_to="gallery/%Y/%m/")
    caption             = CharField(max_length=300, null=True, blank=True)
    alt_text            = CharField(max_length=200, null=True, blank=True)
    category            = CharField(max_length=50, choices=[
                            ("campus","Campus"), ("students","Students"),
                            ("events","Events"), ("results","Results"), ("other","Other")
                          ], default="other")
    display_order       = PositiveSmallIntegerField(default=0)
    is_active           = BooleanField(default=True)
    uploaded_by         = ForeignKey(CustomUser, on_delete=SET_NULL, null=True)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "content_galleryimage"
        ordering = ["display_order", "-created_at"]
```

#### Table: `content_tickermessage`
```python
class TickerMessage(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    text                = CharField(max_length=500)
    link_url            = CharField(max_length=300, null=True, blank=True)
    link_text           = CharField(max_length=100, null=True, blank=True)
    is_active           = BooleanField(default=True, db_index=True)
    display_order       = PositiveSmallIntegerField(default=0)
    start_date          = DateField(null=True, blank=True)
    end_date            = DateField(null=True, blank=True)
    created_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "content_tickermessage"
        ordering = ["display_order"]
```

---

### APP: fees

#### Table: `fees_feestructure`
```python
class FeeStructure(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    batch               = ForeignKey(Batch, on_delete=CASCADE, related_name="fee_structures")
    label               = CharField(max_length=100)           # "Monthly Fee", "Registration Fee"
    amount              = DecimalField(max_digits=10, decimal_places=2)
    fee_type            = CharField(max_length=20, choices=[
                            ("monthly","Monthly"), ("quarterly","Quarterly"),
                            ("annual","Annual"), ("one_time","One Time"),
                            ("registration","Registration")
                          ])
    due_day             = PositiveSmallIntegerField(null=True, blank=True)  # day of month
    late_fee_per_day    = DecimalField(max_digits=7, decimal_places=2, default=0)
    grace_period_days   = PositiveSmallIntegerField(default=5)
    is_active           = BooleanField(default=True)
    created_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "fees_feestructure"
```

#### Table: `fees_studentfee`
```python
class StudentFee(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    student             = ForeignKey(CustomUser, on_delete=CASCADE, related_name="fee_records",
                            limit_choices_to={"role": "student"})
    batch               = ForeignKey(Batch, on_delete=CASCADE, related_name="fee_records")
    fee_structure       = ForeignKey(FeeStructure, on_delete=SET_NULL, null=True)
    period_label        = CharField(max_length=50)            # "July 2025", "Q1 2025-26"
    period_start        = DateField()
    period_end          = DateField()
    due_date            = DateField(db_index=True)
    amount_due          = DecimalField(max_digits=10, decimal_places=2)
    discount_amount     = DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_reason     = CharField(max_length=200, null=True, blank=True)
    late_fee_applied    = DecimalField(max_digits=10, decimal_places=2, default=0)
    total_payable       = DecimalField(max_digits=10, decimal_places=2)  # calculated
    amount_paid         = DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_due         = DecimalField(max_digits=10, decimal_places=2, default=0)
    status              = CharField(max_length=20, choices=[
                            ("pending","Pending"), ("paid","Paid"), ("partial","Partial"),
                            ("overdue","Overdue"), ("waived","Waived")
                          ], default="pending", db_index=True)
    reminder_count      = PositiveSmallIntegerField(default=0)
    last_reminder_at    = DateTimeField(null=True, blank=True)
    created_by          = ForeignKey(CustomUser, on_delete=SET_NULL, null=True)
    created_at          = DateTimeField(auto_now_add=True)
    updated_at          = DateTimeField(auto_now=True)

    class Meta:
        db_table = "fees_studentfee"
        ordering = ["-due_date"]
        indexes = [
            Index(fields=["student", "status"]),
            Index(fields=["batch", "status"]),
            Index(fields=["due_date", "status"]),
        ]
```

#### Table: `fees_payment`
```python
class Payment(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    student_fee         = ForeignKey(StudentFee, on_delete=CASCADE, related_name="payments")
    student             = ForeignKey(CustomUser, on_delete=CASCADE, related_name="payments",
                            limit_choices_to={"role": "student"})
    receipt_number      = CharField(max_length=20, unique=True, db_index=True)  # auto-gen: AR-2025-0001
    amount_paid         = DecimalField(max_digits=10, decimal_places=2)
    payment_date        = DateField(db_index=True)
    payment_mode        = CharField(max_length=20, choices=[
                            ("cash","Cash"), ("upi","UPI"), ("neft","NEFT/RTGS"),
                            ("cheque","Cheque"), ("card","Card"), ("online","Online Portal")
                          ])
    transaction_id      = CharField(max_length=100, null=True, blank=True)   # for online
    cheque_number       = CharField(max_length=30, null=True, blank=True)
    bank_name           = CharField(max_length=100, null=True, blank=True)
    upi_reference       = CharField(max_length=50, null=True, blank=True)
    notes               = TextField(null=True, blank=True)
    collected_by        = ForeignKey(CustomUser, on_delete=SET_NULL, null=True,
                            related_name="collected_payments",
                            limit_choices_to={"role": "admin"})
    is_verified         = BooleanField(default=False)
    created_at          = DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "fees_payment"
        ordering = ["-payment_date"]
```

---

### APP: notifications

#### Table: `notifications_notification`
```python
class Notification(models.Model):
    id                  = UUIDField(primary_key=True, default=uuid4, editable=False)
    recipient           = ForeignKey(CustomUser, on_delete=CASCADE, related_name="notifications")
    notification_type   = CharField(max_length=40, choices=[
                            ("new_note","New Note Uploaded"),
                            ("announcement","New Announcement"),
                            ("score_added","Test Score Added"),
                            ("attendance_warning","Attendance Warning"),
                            ("chat_message","New Chat Message"),
                            ("fee_reminder","Fee Reminder"),
                            ("fee_overdue","Fee Overdue"),
                            ("new_enquiry","New Enquiry"),
                            ("batch_update","Batch Update"),
                            ("system","System Notification")
                          ], db_index=True)
    title               = CharField(max_length=200)
    message             = TextField()
    link_url            = CharField(max_length=300, null=True, blank=True)
    is_read             = BooleanField(default=False, db_index=True)
    read_at             = DateTimeField(null=True, blank=True)
    related_model       = CharField(max_length=50, null=True, blank=True)  # "StudyMaterial"
    related_object_id   = UUIDField(null=True, blank=True)
    created_at          = DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "notifications_notification"
        ordering = ["-created_at"]
        indexes = [
            Index(fields=["recipient", "is_read", "created_at"]),
            Index(fields=["recipient", "notification_type"]),
        ]
```

---

## 📅 PHASE-BY-PHASE IMPLEMENTATION PLAN

---

## PHASE 1: Foundation & Authentication
**Goal:** Working JWT login system, user models, project scaffolding
**Duration estimate:** 3-4 days

### Step 1.1 — Project Setup
```bash
# Commands to run:
django-admin startproject config .
python manage.py startapp users
# Create: apps/ folder, move users inside
# Create: config/settings/base.py, development.py, production.py
# Create: .env with SECRET_KEY, DATABASE_URL, REDIS_URL
# Create: requirements.txt
```

**Files to create:**
- `config/settings/base.py` — full settings with all INSTALLED_APPS
- `config/settings/development.py` — DEBUG=True, sqlite fallback
- `config/asgi.py` — with Django Channels routing (placeholder for now)
- `.env.example` — all required environment variables
- `utils/renderers.py` — StandardJSONRenderer
- `utils/pagination.py` — StandardPagination (page_size=20)
- `utils/permissions.py` — IsStudent, IsTeacher, IsAdmin, IsTeacherOrAdmin

### Step 1.2 — CustomUser Model
**File:** `apps/users/models.py`

Create in this order:
1. `CustomUser` (AbstractBaseUser + PermissionsMixin)
2. `CustomUserManager`
3. `StudentProfile`, `TeacherProfile`, `ParentProfile`, `AdminProfile`
4. `ParentStudentLink`
5. `OTPRecord`
6. `PasswordResetToken`

Then: `python manage.py makemigrations users && python manage.py migrate`

### Step 1.3 — JWT Auth Endpoints

**File:** `apps/users/views.py` — create these endpoints:

```
POST /api/v1/auth/login/             → email+password → JWT pair
POST /api/v1/auth/login/otp/send/   → phone → generate OTP → SMS
POST /api/v1/auth/login/otp/verify/ → phone+otp → JWT pair
POST /api/v1/auth/token/refresh/    → refresh → new access token
POST /api/v1/auth/logout/           → blacklist refresh token
POST /api/v1/auth/forgot-password/  → email → send reset link
POST /api/v1/auth/reset-password/   → token+newpass → update
GET  /api/v1/auth/me/               → current user profile
PATCH /api/v1/auth/me/              → update own profile
```

### Step 1.4 — User Management (Admin)
```
GET    /api/v1/users/                → list all users (admin, with filters)
POST   /api/v1/users/                → create single user
GET    /api/v1/users/{id}/           → get user detail
PATCH  /api/v1/users/{id}/           → update user
DELETE /api/v1/users/{id}/           → deactivate (soft delete)
POST   /api/v1/users/bulk-upload/    → CSV bulk create students
GET    /api/v1/users/bulk-upload/{log_id}/ → upload status
```

### Step 1.5 — API Docs Setup
```python
# config/urls.py — add:
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns += [
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
```

**Phase 1 Deliverable:** Login works via Postman/Swagger, JWT tokens issued, user CRUD working

---

## PHASE 2: Academic Core (Batches, Subjects, Enrollment)
**Goal:** Complete batch management, teacher-subject mapping, student enrollment
**Duration estimate:** 2-3 days

### Step 2.1 — Subjects App
```
GET    /api/v1/subjects/             → list subjects
POST   /api/v1/subjects/             → create (admin)
PATCH  /api/v1/subjects/{id}/        → update (admin)
DELETE /api/v1/subjects/{id}/        → deactivate (admin)
```

### Step 2.2 — Batches App
```
GET    /api/v1/batches/                          → list batches (filtered by role)
POST   /api/v1/batches/                          → create batch (admin)
GET    /api/v1/batches/{id}/                     → batch detail
PATCH  /api/v1/batches/{id}/                     → update batch (admin)
GET    /api/v1/batches/{id}/students/            → students in batch
GET    /api/v1/batches/{id}/teachers/            → teachers in batch
POST   /api/v1/batches/{id}/assign-teacher/      → assign teacher+subject
DELETE /api/v1/batches/{id}/remove-teacher/{tid}/ → remove teacher
POST   /api/v1/batches/{id}/enroll-student/      → enroll student
POST   /api/v1/batches/{id}/transfer-student/    → transfer student to another batch
```

### Step 2.3 — Enrollment Management
```
GET    /api/v1/enrollments/          → list (admin: all, student: own)
PATCH  /api/v1/enrollments/{id}/     → update status (admin)
```

**Phase 2 Deliverable:** Admin can create batches, assign teachers, enroll students

---

## PHASE 3: Notes & Announcements
**Goal:** Teacher uploads notes, students access them, announcements system
**Duration estimate:** 3 days

### Step 3.1 — Notes Upload
```
GET    /api/v1/notes/                → list notes (batch-scoped for students)
POST   /api/v1/notes/                → upload note (teacher/admin, multipart)
GET    /api/v1/notes/{id}/           → note detail
PATCH  /api/v1/notes/{id}/           → update metadata (owner/admin)
DELETE /api/v1/notes/{id}/           → soft delete (owner/admin)
GET    /api/v1/notes/{id}/download/  → secure download (logs, then stream)
GET    /api/v1/notes/{id}/stats/     → download count + who downloaded (teacher/admin)
POST   /api/v1/notes/{id}/assign-batch/ → assign/remove batch (teacher/admin)
```

**Secure download implementation:**
```python
# views.py
@action(detail=True, methods=["get"])
def download(self, request, pk=None):
    note = self.get_object()  # checks permission
    # Log the download
    DownloadLog.objects.get_or_create(study_material=note, student=request.user)
    note.total_downloads = F("total_downloads") + 1
    note.save(update_fields=["total_downloads"])
    # Stream the file
    response = FileResponse(note.file.open("rb"), content_type=note.mime_type)
    response["Content-Disposition"] = f'attachment; filename="{note.file_name}"'
    return response
```

### Step 3.2 — Announcements
```
GET    /api/v1/announcements/                    → list (filtered by role/batch)
POST   /api/v1/announcements/                    → create (teacher/admin)
GET    /api/v1/announcements/{id}/               → detail
PATCH  /api/v1/announcements/{id}/               → update (owner/admin)
DELETE /api/v1/announcements/{id}/               → soft delete
POST   /api/v1/announcements/{id}/mark-read/     → mark as read (student)
GET    /api/v1/announcements/{id}/stats/         → seen count (teacher/admin)
POST   /api/v1/announcements/{id}/resend/        → resend to unseen students
```

**Phase 3 Deliverable:** Teachers upload notes, students download them, download tracked, announcements working

---

## PHASE 4: Performance (Scores & Attendance)
**Goal:** Test score entry, attendance marking, analytics
**Duration estimate:** 3 days

### Step 4.1 — Test Scores
```
GET    /api/v1/scores/                           → list (scoped by role)
POST   /api/v1/scores/                           → add score (teacher/admin)
POST   /api/v1/scores/bulk-upload/               → CSV score upload
PATCH  /api/v1/scores/{id}/                      → update score
DELETE /api/v1/scores/{id}/                      → delete (teacher/admin)
GET    /api/v1/scores/analytics/student/{id}/    → student performance report
GET    /api/v1/scores/analytics/batch/{id}/      → batch performance report
GET    /api/v1/scores/analytics/teacher/{id}/    → teacher's batch comparison
```

### Step 4.2 — Attendance
```
GET    /api/v1/attendance/sessions/              → list sessions (batch-scoped)
POST   /api/v1/attendance/sessions/              → create session + mark attendance
GET    /api/v1/attendance/sessions/{id}/         → session detail with all records
PATCH  /api/v1/attendance/sessions/{id}/records/ → update individual records
GET    /api/v1/attendance/student/{id}/summary/  → attendance % per subject
GET    /api/v1/attendance/student/{id}/warnings/ → below-threshold warnings
```

### Step 4.3 — Analytics
Calculated fields via ORM:
```python
# Student analytics example:
scores = TestScore.objects.filter(student=student, is_absent=False)
subject_analytics = scores.values("subject__name").annotate(
    avg_score=Avg("percentage"),
    total_tests=Count("id"),
    best_score=Max("percentage"),
    worst_score=Min("percentage"),
).order_by("subject__name")
```

**Phase 4 Deliverable:** Teacher enters scores, marks attendance, student sees performance charts

---

## PHASE 5: Real-Time Chat (WebSocket + Django Channels)
**Goal:** 1-on-1 chat, group batch chat, real-time delivery
**Duration estimate:** 4-5 days

### Step 5.1 — Channels Setup
```python
# config/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from apps.chat.routing import websocket_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})

# apps/chat/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<conversation_id>[0-9a-f-]+)/$", consumers.ChatConsumer.as_asgi()),
    re_path(r"ws/group/(?P<batch_id>[0-9a-f-]+)/$", consumers.GroupChatConsumer.as_asgi()),
]
```

### Step 5.2 — Chat REST Endpoints
```
GET    /api/v1/chat/conversations/                    → my conversations list
POST   /api/v1/chat/conversations/                    → start new conversation
GET    /api/v1/chat/conversations/{id}/messages/      → get messages (paginated, oldest first)
POST   /api/v1/chat/conversations/{id}/messages/      → send message (REST fallback)
POST   /api/v1/chat/conversations/{id}/read/          → mark all as read
GET    /api/v1/chat/groups/                           → my group chats
GET    /api/v1/chat/groups/{batch_id}/messages/       → group messages
POST   /api/v1/chat/groups/{batch_id}/pin/{msg_id}/   → pin message (teacher/admin)
```

### Step 5.3 — WebSocket Consumer Events
```python
# Message types over WebSocket:

# CLIENT → SERVER:
{"type": "chat.message",  "content": "Hello!", "reply_to": null}
{"type": "chat.typing",   "is_typing": true}
{"type": "chat.read",     "message_id": "uuid"}
{"type": "chat.file",     "file_name": "note.pdf", "file_data": "base64"}

# SERVER → CLIENT:
{"type": "chat.message",  "id": "uuid", "sender": {...}, "content": "...", "created_at": "..."}
{"type": "chat.typing",   "user_id": "uuid", "is_typing": true}
{"type": "chat.read",     "reader_id": "uuid", "message_ids": ["uuid"]}
{"type": "chat.online",   "user_id": "uuid", "is_online": true}
{"type": "chat.error",    "code": "UNAUTHORIZED", "message": "..."}
```

### Step 5.4 — JWT Auth in WebSocket
```python
# apps/chat/middleware.py
from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.tokens import AccessToken

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token = query_string.get("token", [None])[0]
        if token:
            try:
                access_token = AccessToken(token)
                user_id = access_token["user_id"]
                # Fetch user and attach to scope
                scope["user"] = await self.get_user(user_id)
            except Exception:
                scope["user"] = None
        await super().__call__(scope, receive, send)
```

**Phase 5 Deliverable:** ws://domain/ws/chat/{conv_id}/?token=JWT works, messages real-time

---

## PHASE 6: CMS & Enquiries
**Goal:** Landing page content manageable from admin, contact form saved
**Duration estimate:** 2-3 days

### Step 6.1 — Enquiry Endpoints
```
POST   /api/v1/enquiries/                        → submit (PUBLIC, no auth)
GET    /api/v1/enquiries/                        → list (admin only)
GET    /api/v1/enquiries/{id}/                   → detail (admin)
PATCH  /api/v1/enquiries/{id}/                   → update status/assign (admin)
POST   /api/v1/enquiries/{id}/log/               → add follow-up log
GET    /api/v1/enquiries/{id}/logs/              → list follow-up logs
GET    /api/v1/enquiries/stats/                  → counts per status (admin)
```

**Enquiry submit logic:**
```python
def create(self, request):
    # 1. Save enquiry
    # 2. Check duplicate (same phone in last 24h)
    # 3. If not duplicate: queue SMS to student (Celery task)
    # 4. Queue email alert to admin (Celery task)
    # 5. Return 201 with "success" message
```

### Step 6.2 — Content CMS Endpoints

**Public endpoints (no auth):**
```
GET /api/v1/content/hero/            → hero config
GET /api/v1/content/about/           → about section
GET /api/v1/content/courses/         → courses list
GET /api/v1/content/faculty/         → faculty list (active only)
GET /api/v1/content/toppers/         → toppers list (active, ordered)
GET /api/v1/content/testimonials/    → testimonials (active, ordered)
GET /api/v1/content/gallery/         → gallery images
GET /api/v1/content/achievements/    → stats config
GET /api/v1/content/ticker/          → active ticker messages
```

**Admin endpoints (IsAdmin):**
```
PUT    /api/v1/content/hero/                     → update hero
PUT    /api/v1/content/achievements/             → update stats
POST   /api/v1/content/faculty/                  → add faculty
PATCH  /api/v1/content/faculty/{id}/             → update faculty
DELETE /api/v1/content/faculty/{id}/             → deactivate
POST   /api/v1/content/toppers/                  → add topper
PATCH  /api/v1/content/toppers/{id}/             → update topper
POST   /api/v1/content/testimonials/             → add testimonial
PATCH  /api/v1/content/testimonials/{id}/        → update
POST   /api/v1/content/gallery/                  → upload image
DELETE /api/v1/content/gallery/{id}/             → remove
POST   /api/v1/content/ticker/                   → add ticker
PATCH  /api/v1/content/ticker/{id}/              → update
```

**Phase 6 Deliverable:** Landing page fetches all data from API, admin can update everything

---

## PHASE 7: Fees & Notifications
**Goal:** Fee tracking, payment recording, in-app notification system
**Duration estimate:** 2-3 days

### Step 7.1 — Fee Endpoints
```
GET    /api/v1/fees/structures/                  → list fee structures (admin)
POST   /api/v1/fees/structures/                  → create (admin)
GET    /api/v1/fees/records/                     → list student fees (admin: all, student: own)
POST   /api/v1/fees/records/                     → create fee record (admin)
GET    /api/v1/fees/records/{id}/                → detail
POST   /api/v1/fees/payments/                    → record payment (admin)
GET    /api/v1/fees/payments/{id}/receipt/       → generate receipt (PDF)
GET    /api/v1/fees/student/{id}/summary/        → student fee summary
POST   /api/v1/fees/reminders/                   → send bulk SMS reminders (admin)
GET    /api/v1/fees/overdue/                     → list overdue fees (admin)
```

### Step 7.2 — Notifications
```
GET    /api/v1/notifications/                    → my notifications (paginated)
GET    /api/v1/notifications/unread-count/       → {"count": 5}
POST   /api/v1/notifications/{id}/read/          → mark one as read
POST   /api/v1/notifications/read-all/           → mark all as read
DELETE /api/v1/notifications/{id}/               → delete notification
```

**Notification triggers via Django Signals:**
```python
# apps/notes/signals.py
@receiver(post_save, sender=StudyMaterial)
def notify_on_note_publish(sender, instance, created, **kwargs):
    if instance.status == "published":
        # Find all students in assigned batches
        # Create Notification for each
        # Send WebSocket push via channel layer
        pass
```

**Phase 7 Deliverable:** Fee records work, payments logged, students get in-app notifications

---

## PHASE 8: API Docs, Testing & Security
**Goal:** Complete API documentation, test coverage, production-ready security
**Duration estimate:** 3 days

### Step 8.1 — drf-spectacular Full Docs
Add `@extend_schema` to EVERY ViewSet:
```python
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample

@extend_schema(tags=["Notes"])
class StudyMaterialViewSet(ModelViewSet):

    @extend_schema(
        summary="Upload Study Material",
        description="Teacher uploads a note/video/PDF for specific batches. File is stored securely.",
        request=StudyMaterialCreateSerializer,
        responses={201: StudyMaterialSerializer, 400: "Validation error", 403: "Not a teacher"},
        parameters=[
            OpenApiParameter("batch", description="Filter by batch UUID", type=str),
            OpenApiParameter("subject", description="Filter by subject UUID", type=str),
        ]
    )
    def create(self, request, *args, **kwargs):
        ...
```

### Step 8.2 — Test Coverage
Write tests for these at minimum:
```
tests/test_auth.py           → login, OTP, refresh, logout
tests/test_users.py          → CRUD, bulk upload, access control
tests/test_notes.py          → upload, download, batch scoping
tests/test_chat.py           → REST endpoints (WebSocket separately)
tests/test_enquiries.py      → submit, SMS dedup, admin workflow
tests/test_content.py        → public read, admin update
tests/test_permissions.py    → student can't access teacher routes, etc.
```

### Step 8.3 — Security Hardening
```python
# Add to settings:
REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = [
    "rest_framework.throttling.AnonRateThrottle",
    "rest_framework.throttling.UserRateThrottle",
]
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {
    "anon": "100/day",
    "user": "1000/day",
    "login": "5/min",       # custom throttle for auth
    "otp": "3/hour",        # custom throttle for OTP
}

# CORS:
CORS_ALLOWED_ORIGINS = ["https://aarambhinstitute.in", "http://localhost:5173"]
CORS_ALLOW_CREDENTIALS = True
```

**Phase 8 Deliverable:** Swagger docs at /api/docs/, 70%+ test coverage, security hardened

---

## 📐 API URL STRUCTURE SUMMARY

```
/api/v1/
├── auth/
│   ├── login/
│   ├── login/otp/send/
│   ├── login/otp/verify/
│   ├── token/refresh/
│   ├── logout/
│   ├── me/
│   ├── forgot-password/
│   └── reset-password/
├── users/
│   ├── {list, detail, create}
│   └── bulk-upload/
├── subjects/
├── batches/
│   └── {id}/students|teachers|enroll|transfer
├── enrollments/
├── notes/
│   └── {id}/download|stats|assign-batch
├── announcements/
│   └── {id}/mark-read|stats|resend
├── scores/
│   ├── bulk-upload/
│   └── analytics/student|batch|teacher/
├── attendance/
│   └── sessions/{id}/records
├── chat/
│   ├── conversations/{id}/messages|read
│   └── groups/{batch_id}/messages|pin
├── enquiries/
│   └── {id}/log|logs
├── content/
│   ├── hero|about|achievements|courses|ticker (GET=public, PUT=admin)
│   ├── faculty/ (GET=public, POST/PATCH/DELETE=admin)
│   ├── toppers/ (GET=public, POST/PATCH=admin)
│   ├── testimonials/ (GET=public, POST/PATCH=admin)
│   └── gallery/ (GET=public, POST/DELETE=admin)
├── fees/
│   ├── structures/
│   ├── records/
│   ├── payments/
│   │   └── {id}/receipt/
│   ├── overdue/
│   └── reminders/
└── notifications/
    ├── unread-count/
    ├── {id}/read/
    └── read-all/

WebSocket:
ws://domain/ws/chat/{conversation_uuid}/?token={jwt}
ws://domain/ws/group/{batch_uuid}/?token={jwt}

API Docs:
/api/docs/       → Swagger UI
/api/redoc/      → ReDoc
/api/schema/     → OpenAPI JSON/YAML
```

---

## ⚠️ CRITICAL NOTES FOR AGENT

1. **CustomUser first** — migrations fail if you don't set `AUTH_USER_MODEL = "users.CustomUser"` BEFORE first migrate
2. **UUID in PostgreSQL** — use `UUIDField` not `CharField(max_length=36)` — Postgres has native UUID type
3. **Channels requires Daphne** — run with `daphne config.asgi:application`, not `python manage.py runserver` for WebSocket
4. **File uploads** — always rename file to UUID on save using `upload_to` callable
5. **Token blacklist** — add `"rest_framework_simplejwt.token_blacklist"` to INSTALLED_APPS and run migrations
6. **Redis must be running** — for Channels and Celery; use `docker run -d -p 6379:6379 redis` in dev
7. **Celery** — run separately: `celery -A config worker -l info` for async tasks
8. **drf-spectacular** — run `python manage.py spectacular --file schema.yml` to generate static schema
9. **Never run migrations on prod without backup** — always `--check` first
10. **ASGI vs WSGI** — with Channels, you MUST use ASGI (Daphne/Uvicorn), not Gunicorn

---

*Aarambh Institute — Backend Agent Handover*
*Read with: SKILL.md + SUPERPOWER.md*
*Frontend: React 18 + Vite + TypeScript*
*Backend: Django 5 + DRF + Channels + JWT + PostgreSQL + Redis + Celery*

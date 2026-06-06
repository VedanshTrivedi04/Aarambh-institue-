import uuid
from django.db import models
from utils.storage import get_upload_path

class Testimonial(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name            = models.CharField(max_length=150)
    role            = models.CharField(max_length=150, help_text="e.g. 'Student, JEE 2024'")
    content         = models.TextField()
    image           = models.ImageField(upload_to=get_upload_path, null=True, blank=True)
    rating          = models.PositiveIntegerField(default=5)
    is_active       = models.BooleanField(default=True)
    order           = models.PositiveIntegerField(default=0)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "content_testimonial"
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.name

class FAQ(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question        = models.CharField(max_length=255)
    answer          = models.TextField()
    category        = models.CharField(max_length=100, default='General')
    is_active       = models.BooleanField(default=True)
    order           = models.PositiveIntegerField(default=0)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "content_faq"
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.question

class SuccessStory(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student_name    = models.CharField(max_length=150)
    exam            = models.CharField(max_length=100)
    rank_or_score   = models.CharField(max_length=100)
    year            = models.CharField(max_length=4)
    image           = models.ImageField(upload_to=get_upload_path, null=True, blank=True)
    story           = models.TextField(null=True, blank=True)
    is_active       = models.BooleanField(default=True)
    order           = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "content_successstory"
        ordering = ['order', '-year']

    def __str__(self):
        return f"{self.student_name} - {self.exam} {self.year}"

class Branch(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name            = models.CharField(max_length=150)
    address         = models.TextField()
    phone           = models.CharField(max_length=50)
    email           = models.EmailField(null=True, blank=True)
    map_url         = models.URLField(null=True, blank=True)
    is_head_office  = models.BooleanField(default=False)
    is_active       = models.BooleanField(default=True)
    order           = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "content_branch"
        ordering = ['-is_head_office', 'order']

    def __str__(self):
        return self.name

class CarouselBanner(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title           = models.CharField(max_length=200, null=True, blank=True)
    subtitle        = models.CharField(max_length=200, null=True, blank=True)
    image_desktop   = models.ImageField(upload_to=get_upload_path)
    image_mobile    = models.ImageField(upload_to=get_upload_path, null=True, blank=True)
    cta_text        = models.CharField(max_length=50, null=True, blank=True)
    cta_link        = models.URLField(null=True, blank=True)
    is_active       = models.BooleanField(default=True)
    order           = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "content_carouselbanner"
        ordering = ['order']

    def __str__(self):
        return self.title or f"Banner {self.id}"

class Event(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title           = models.CharField(max_length=200)
    description     = models.TextField()
    date            = models.DateTimeField()
    location        = models.CharField(max_length=200)
    image           = models.ImageField(upload_to=get_upload_path, null=True, blank=True)
    registration_url= models.URLField(null=True, blank=True)
    is_active       = models.BooleanField(default=True)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "content_event"
        ordering = ['-date']

    def __str__(self):
        return self.title

class GalleryImage(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title           = models.CharField(max_length=150, null=True, blank=True)
    image           = models.ImageField(upload_to=get_upload_path)
    category        = models.CharField(max_length=100, default='General')
    is_active       = models.BooleanField(default=True)
    order           = models.PositiveIntegerField(default=0)
    created_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "content_galleryimage"
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title or f"Gallery Image {self.id}"

class Course(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name            = models.CharField(max_length=150)
    slug            = models.SlugField(unique=True)
    short_desc      = models.CharField(max_length=255)
    description     = models.TextField()
    features        = models.JSONField(default=list, help_text="List of string features")
    image           = models.ImageField(upload_to=get_upload_path, null=True, blank=True)
    brochure        = models.FileField(upload_to=get_upload_path, null=True, blank=True)
    target_exam     = models.CharField(max_length=50)
    is_active       = models.BooleanField(default=True)
    order           = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "content_course"
        ordering = ['order']

    def __str__(self):
        return self.name

from django.contrib import admin
from .models import Subject, Batch, BatchEnrollment

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'created_at')
    search_fields = ('name', 'code')

@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = ('name', 'class_grade', 'target_exam', 'status', 'current_strength', 'max_capacity')
    list_filter = ('status', 'class_grade', 'target_exam')
    search_fields = ('name',)
    filter_horizontal = ('subjects', 'primary_teachers')

@admin.register(BatchEnrollment)
class BatchEnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'batch', 'status', 'enrolled_at')
    list_filter = ('status', 'batch')
    search_fields = ('student__email', 'student__first_name', 'student__last_name')

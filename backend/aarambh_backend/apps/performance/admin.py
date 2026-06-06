from django.contrib import admin
from .models import AttendanceSession, AttendanceRecord, Test, Score

@admin.register(AttendanceSession)
class AttendanceSessionAdmin(admin.ModelAdmin):
    list_display = ('batch', 'date', 'marked_by', 'created_at')
    list_filter = ('date', 'batch')

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('session', 'student', 'status')
    list_filter = ('status', 'session__batch')
    search_fields = ('student__email', 'student__first_name')

@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ('title', 'batch', 'subject', 'date', 'max_marks')
    list_filter = ('date', 'batch', 'subject')
    search_fields = ('title',)

@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ('test', 'student', 'marks_obtained', 'rank')
    list_filter = ('test__batch',)
    search_fields = ('student__email', 'student__first_name')

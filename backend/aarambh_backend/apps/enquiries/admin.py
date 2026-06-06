from django.contrib import admin
from .models import Enquiry, FollowUp

class FollowUpInline(admin.TabularInline):
    model = FollowUp
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'phone_number', 'target_exam', 'status', 'assigned_to', 'created_at')
    list_filter = ('status', 'target_exam', 'assigned_to')
    search_fields = ('student_name', 'phone_number', 'email')
    inlines = [FollowUpInline]

@admin.register(FollowUp)
class FollowUpAdmin(admin.ModelAdmin):
    list_display = ('enquiry', 'handled_by', 'date', 'method')
    list_filter = ('method', 'handled_by', 'date')
    search_fields = ('enquiry__student_name', 'summary')

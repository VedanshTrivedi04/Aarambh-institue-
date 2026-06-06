from django.contrib import admin
from .models import Note

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'file_type', 'is_published', 'uploaded_by', 'created_at')
    list_filter = ('file_type', 'is_published', 'subject')
    search_fields = ('title', 'description')
    filter_horizontal = ('batches',)

from django.contrib import admin
from .models import Announcement, AnnouncementReadReceipt

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'priority', 'is_global', 'author', 'created_at')
    list_filter = ('priority', 'is_global')
    search_fields = ('title', 'content')
    filter_horizontal = ('target_batches',)

@admin.register(AnnouncementReadReceipt)
class AnnouncementReadReceiptAdmin(admin.ModelAdmin):
    list_display = ('announcement', 'user', 'read_at')
    search_fields = ('announcement__title', 'user__email')

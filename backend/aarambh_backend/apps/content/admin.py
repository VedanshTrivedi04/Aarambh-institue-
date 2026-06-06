from django.contrib import admin
from .models import (
    Testimonial, FAQ, SuccessStory, Branch, 
    CarouselBanner, Event, GalleryImage, Course
)

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'rating', 'is_active', 'order')
    list_editable = ('is_active', 'order')

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'is_active', 'order')
    list_filter = ('category', 'is_active')
    list_editable = ('is_active', 'order')

@admin.register(SuccessStory)
class SuccessStoryAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'exam', 'year', 'rank_or_score', 'is_active', 'order')
    list_filter = ('exam', 'year', 'is_active')
    list_editable = ('is_active', 'order')

@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_head_office', 'is_active', 'order')
    list_editable = ('is_head_office', 'is_active', 'order')

@admin.register(CarouselBanner)
class CarouselBannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'order')
    list_editable = ('is_active', 'order')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location', 'is_active')
    list_filter = ('is_active', 'date')
    list_editable = ('is_active',)

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_active', 'order')
    list_filter = ('category', 'is_active')
    list_editable = ('is_active', 'order')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'target_exam', 'is_active', 'order')
    list_filter = ('target_exam', 'is_active')
    list_editable = ('is_active', 'order')
    prepopulated_fields = {'slug': ('name',)}

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TestimonialViewSet, FAQViewSet, SuccessStoryViewSet, BranchViewSet,
    CarouselBannerViewSet, EventViewSet, GalleryImageViewSet, CourseViewSet
)

router = DefaultRouter()
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'success-stories', SuccessStoryViewSet, basename='success-story')
router.register(r'branches', BranchViewSet, basename='branch')
router.register(r'banners', CarouselBannerViewSet, basename='banner')
router.register(r'events', EventViewSet, basename='event')
router.register(r'gallery', GalleryImageViewSet, basename='gallery')
router.register(r'courses', CourseViewSet, basename='course')

urlpatterns = [
    path('content/', include(router.urls)),
]

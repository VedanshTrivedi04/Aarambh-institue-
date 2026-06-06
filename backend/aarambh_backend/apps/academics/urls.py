from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import SubjectViewSet, BatchViewSet, BatchEnrollmentViewSet

router = DefaultRouter()
router.register(r'subjects', SubjectViewSet, basename='subject')
router.register(r'batches', BatchViewSet, basename='batch')
router.register(r'enrollments', BatchEnrollmentViewSet, basename='enrollment')

urlpatterns = [
    path('academics/', include(router.urls)),
]

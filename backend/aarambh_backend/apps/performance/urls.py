from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AttendanceSessionViewSet, AttendanceRecordViewSet, TestViewSet, ScoreViewSet

router = DefaultRouter()
router.register(r'attendance/sessions', AttendanceSessionViewSet, basename='attendance-session')
router.register(r'attendance/records', AttendanceRecordViewSet, basename='attendance-record')
router.register(r'tests', TestViewSet, basename='test')
router.register(r'scores', ScoreViewSet, basename='score')

urlpatterns = [
    path('performance/', include(router.urls)),
]

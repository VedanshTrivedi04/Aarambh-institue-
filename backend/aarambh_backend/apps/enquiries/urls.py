from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import EnquiryViewSet, FollowUpViewSet

router = DefaultRouter()
router.register(r'leads', EnquiryViewSet, basename='enquiry')
router.register(r'followups', FollowUpViewSet, basename='followup')

urlpatterns = [
    path('enquiries/', include(router.urls)),
]

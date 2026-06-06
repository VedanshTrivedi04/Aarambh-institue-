from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FeeStructureViewSet, StudentFeeViewSet, PaymentViewSet

router = DefaultRouter()
router.register(r'structures', FeeStructureViewSet, basename='feestructure')
router.register(r'student-fees', StudentFeeViewSet, basename='studentfee')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    path('fees/', include(router.urls)),
]

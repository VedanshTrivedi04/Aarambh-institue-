from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import FeeStructure, StudentFee, Payment
from .serializers import FeeStructureSerializer, StudentFeeSerializer, PaymentSerializer
from utils.permissions import IsAdmin, IsTeacherOrAdmin

class FeeStructureViewSet(viewsets.ModelViewSet):
    """
    Admins create FeeStructures for Batches.
    Students can view fee structures for their enrolled batches.
    """
    queryset = FeeStructure.objects.all()
    serializer_class = FeeStructureSerializer
    filterset_fields = ['batch']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

class StudentFeeViewSet(viewsets.ModelViewSet):
    """
    Tracks which student owes which FeeStructure.
    Students can see their own fees. Admins can view/manage all.
    """
    serializer_class = StudentFeeSerializer
    filterset_fields = ['student', 'fee_structure', 'is_fully_paid']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if getattr(self, 'swagger_fake_view', False):
            return StudentFee.objects.none()
            
        if user.role == 'admin':
            return StudentFee.objects.all()
        elif user.role == 'student':
            return StudentFee.objects.filter(student=user)
        return StudentFee.objects.none()

class PaymentViewSet(viewsets.ModelViewSet):
    """
    Records a payment against a StudentFee.
    Admins can create payments. Students can view their payment history.
    """
    serializer_class = PaymentSerializer
    filterset_fields = ['student_fee', 'status', 'payment_method']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if getattr(self, 'swagger_fake_view', False):
            return Payment.objects.none()
            
        if user.role == 'admin':
            return Payment.objects.all()
        elif user.role == 'student':
            return Payment.objects.filter(student_fee__student=user)
        return Payment.objects.none()

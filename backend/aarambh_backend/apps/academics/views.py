from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Subject, Batch, BatchEnrollment
from .serializers import SubjectSerializer, BatchSerializer, BatchEnrollmentSerializer
from utils.permissions import IsAdmin, IsTeacherOrAdmin

class SubjectViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Subjects.
    Only Admins can modify. Teachers and Students can view.
    """
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    filterset_fields = ['code']
    search_fields = ['name', 'code', 'description']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

class BatchViewSet(viewsets.ModelViewSet):
    """
    CRUD operations for Batches.
    Admins manage batches. Teachers can view batches they are assigned to.
    Students can view batches they are enrolled in.
    """
    serializer_class = BatchSerializer
    filterset_fields = ['status', 'class_grade', 'target_exam']
    search_fields = ['name']

    def get_queryset(self):
        user = self.request.user
        if getattr(self, 'swagger_fake_view', False):
            return Batch.objects.none()
            
        if user.role == 'admin':
            return Batch.objects.all()
        elif user.role == 'teacher':
            return Batch.objects.filter(primary_teachers=user, status='active')
        elif user.role == 'student':
            return Batch.objects.filter(enrollments__student=user, enrollments__status='active')
        return Batch.objects.none()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]

class BatchEnrollmentViewSet(viewsets.ModelViewSet):
    """
    Manage student enrollments in batches.
    Only Admins can create/update enrollments.
    """
    queryset = BatchEnrollment.objects.all()
    serializer_class = BatchEnrollmentSerializer
    filterset_fields = ['status', 'batch', 'student']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsAdmin()]
        
    def perform_create(self, serializer):
        enrollment = serializer.save()
        # Increment batch strength
        batch = enrollment.batch
        batch.current_strength = batch.enrollments.filter(status='active').count()
        batch.save(update_fields=['current_strength'])

    def perform_update(self, serializer):
        enrollment = serializer.save()
        # Update batch strength
        batch = enrollment.batch
        batch.current_strength = batch.enrollments.filter(status='active').count()
        batch.save(update_fields=['current_strength'])

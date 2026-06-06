from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from .models import Announcement, AnnouncementReadReceipt
from .serializers import AnnouncementSerializer
from utils.permissions import IsTeacherOrAdmin

class AnnouncementViewSet(viewsets.ModelViewSet):
    """
    CRUD for Announcements.
    Students can view global announcements and announcements for their batches.
    Teachers can manage announcements for their batches.
    Admins have full access.
    """
    serializer_class = AnnouncementSerializer
    parser_classes = [MultiPartParser, FormParser]
    filterset_fields = ['priority', 'is_global']
    search_fields = ['title', 'content']

    def get_queryset(self):
        user = self.request.user
        if getattr(self, 'swagger_fake_view', False):
            return Announcement.objects.none()
            
        if user.role == 'admin':
            return Announcement.objects.all()
        elif user.role == 'teacher':
            return Announcement.objects.filter(
                Q(is_global=True) | Q(target_batches__primary_teachers=user)
            ).distinct()
        elif user.role == 'student':
            return Announcement.objects.filter(
                Q(is_global=True) | 
                Q(target_batches__enrollments__student=user, target_batches__enrollments__status='active')
            ).distinct()
        elif user.role == 'parent':
            # Parents see global and their children's announcements
            return Announcement.objects.filter(
                Q(is_global=True) | 
                Q(target_batches__enrollments__student__linked_parents__parent=user, target_batches__enrollments__status='active')
            ).distinct()
        return Announcement.objects.none()

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'mark_read']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsTeacherOrAdmin()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], url_path='read')
    def mark_read(self, request, pk=None):
        announcement = self.get_object()
        AnnouncementReadReceipt.objects.get_or_create(
            announcement=announcement,
            user=request.user
        )
        return Response({"status": "marked as read"})

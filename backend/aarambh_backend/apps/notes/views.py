from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Note
from .serializers import NoteSerializer
from utils.permissions import IsTeacherOrAdmin

class NoteViewSet(viewsets.ModelViewSet):
    """
    CRUD for study materials.
    Students can view published notes for their enrolled batches.
    Teachers can manage notes for their batches.
    Admins have full access.
    """
    serializer_class = NoteSerializer
    parser_classes = [MultiPartParser, FormParser]
    filterset_fields = ['subject', 'file_type', 'is_published']
    search_fields = ['title', 'description']

    def get_queryset(self):
        user = self.request.user
        if getattr(self, 'swagger_fake_view', False):
            return Note.objects.none()
            
        if user.role == 'admin':
            return Note.objects.all()
        elif user.role == 'teacher':
            return Note.objects.filter(batches__primary_teachers=user).distinct()
        elif user.role == 'student':
            return Note.objects.filter(
                is_published=True,
                batches__enrollments__student=user,
                batches__enrollments__status='active'
            ).distinct()
        return Note.objects.none()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsTeacherOrAdmin()]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)

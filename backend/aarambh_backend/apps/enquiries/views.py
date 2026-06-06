from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Enquiry, FollowUp
from .serializers import EnquirySerializer, PublicEnquirySerializer, FollowUpSerializer
from utils.permissions import IsAdmin, IsTeacherOrAdmin

class EnquiryViewSet(viewsets.ModelViewSet):
    """
    Enquiries API.
    Public can POST to create a lead.
    Admins can view and manage all leads.
    Teachers can view leads assigned to them.
    """
    filterset_fields = ['status', 'target_exam', 'assigned_to']
    search_fields = ['student_name', 'phone_number', 'email']

    def get_serializer_class(self):
        if self.action == 'create' and not self.request.user.is_authenticated:
            return PublicEnquirySerializer
        return EnquirySerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated(), IsTeacherOrAdmin()]

    def get_queryset(self):
        user = self.request.user
        if getattr(self, 'swagger_fake_view', False) or not user.is_authenticated:
            return Enquiry.objects.none()
            
        if user.role == 'admin':
            return Enquiry.objects.all()
        elif user.role == 'teacher':
            return Enquiry.objects.filter(assigned_to=user)
        return Enquiry.objects.none()

class FollowUpViewSet(viewsets.ModelViewSet):
    """
    Follow-up API.
    Used by admins/teachers to log interactions with leads.
    """
    queryset = FollowUp.objects.all()
    serializer_class = FollowUpSerializer
    filterset_fields = ['enquiry']

    def get_permissions(self):
        return [IsAuthenticated(), IsTeacherOrAdmin()]

    def perform_create(self, serializer):
        serializer.save(handled_by=self.request.user)

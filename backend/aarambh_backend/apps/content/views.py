from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import (
    Testimonial, FAQ, SuccessStory, Branch, 
    CarouselBanner, Event, GalleryImage, Course
)
from .serializers import (
    TestimonialSerializer, FAQSerializer, SuccessStorySerializer, 
    BranchSerializer, CarouselBannerSerializer, EventSerializer, 
    GalleryImageSerializer, CourseSerializer
)
from utils.permissions import IsAdmin

class CMSBaseViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet for all CMS models.
    Public (unauthenticated) can GET (list, retrieve) active objects.
    Only Admins can POST/PUT/PATCH/DELETE.
    """
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticatedOrReadOnly()]
        return [IsAdmin()]

    def get_queryset(self):
        user = self.request.user
        if getattr(self, 'swagger_fake_view', False):
            return self.queryset.none()
            
        if user.is_authenticated and user.role == 'admin':
            return self.queryset.all()
        return self.queryset.filter(is_active=True)

class TestimonialViewSet(CMSBaseViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer

class FAQViewSet(CMSBaseViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    filterset_fields = ['category']

class SuccessStoryViewSet(CMSBaseViewSet):
    queryset = SuccessStory.objects.all()
    serializer_class = SuccessStorySerializer
    filterset_fields = ['exam', 'year']

class BranchViewSet(CMSBaseViewSet):
    queryset = Branch.objects.all()
    serializer_class = BranchSerializer

class CarouselBannerViewSet(CMSBaseViewSet):
    queryset = CarouselBanner.objects.all()
    serializer_class = CarouselBannerSerializer

class EventViewSet(CMSBaseViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class GalleryImageViewSet(CMSBaseViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    filterset_fields = ['category']

class CourseViewSet(CMSBaseViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    filterset_fields = ['target_exam']
    lookup_field = 'slug'

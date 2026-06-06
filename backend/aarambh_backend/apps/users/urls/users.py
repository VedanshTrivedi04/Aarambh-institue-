from django.urls import path, include
from rest_framework.routers import DefaultRouter

from ..views import UserViewSet, PublicTeachersView

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('teachers/public/', PublicTeachersView.as_view(), name='public-teachers'),
    path('', include(router.urls)),
]

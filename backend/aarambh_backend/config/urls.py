"""
Aarambh Institute Backend — Root URL Configuration
All API routes versioned under /api/v1/
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    # Django Admin
    path("admin/", admin.site.urls),

    # API v1
    path("api/v1/auth/", include("apps.users.urls.auth")),
    path("api/v1/users/", include("apps.users.urls.users")),
    path("api/v1/", include("apps.academics.urls")),
    path("api/v1/notes/", include("apps.notes.urls")),
    path("api/v1/announcements/", include("apps.announcements.urls")),
    path("api/v1/", include("apps.performance.urls")),
    path("api/v1/", include("apps.chat.urls")),
    path("api/v1/", include("apps.enquiries.urls")),
    path("api/v1/", include("apps.content.urls")),
    path("api/v1/", include("apps.fees.urls")),
    path("api/v1/", include("apps.notifications.urls")),

    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

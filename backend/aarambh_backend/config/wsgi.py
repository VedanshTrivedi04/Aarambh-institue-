"""
Aarambh Institute Backend — WSGI config
For standard HTTP-only deployments (no WebSocket)
"""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

application = get_wsgi_application()

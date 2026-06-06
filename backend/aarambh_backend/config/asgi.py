import os
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

# Initialize Django ASGI application early to ensure AppRegistry is populated
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter  # noqa: E402
from utils.middleware import JwtAuthMiddlewareStack  # noqa: E402
from apps.chat.routing import websocket_urlpatterns as chat_ws_patterns  # noqa: E402
from apps.notifications.routing import websocket_urlpatterns as notification_ws_patterns  # noqa: E402

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": JwtAuthMiddlewareStack(
            URLRouter(
                chat_ws_patterns + notification_ws_patterns
            )
        ),
    }
)

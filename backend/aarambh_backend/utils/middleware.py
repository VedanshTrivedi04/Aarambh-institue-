from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from django.conf import settings

User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class JwtAuthMiddleware:
    """
    Custom middleware that takes a JWT token from the query string and authenticates the user.
    Usage: ws://localhost:8000/ws/chat/room_id/?token=<token>
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # Parse token from query string
        query_string = parse_qs(scope["query_string"].decode("utf8"))
        token = query_string.get("token")

        if token:
            token = token[0]
            try:
                # This validates the token and raises an error if invalid
                UntypedToken(token)
            except (InvalidToken, TokenError) as e:
                # Token is invalid
                scope['user'] = AnonymousUser()
            else:
                # Then decode the token to get the user id
                decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                scope['user'] = await get_user(decoded_data["user_id"])
        else:
            scope['user'] = AnonymousUser()

        return await self.app(scope, receive, send)

def JwtAuthMiddlewareStack(inner):
    return JwtAuthMiddleware(inner)

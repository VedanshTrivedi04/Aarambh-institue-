# SKILL.md — Aarambh Institute Backend Development Skill
## AI Agent Skill Definition File

---

## 🎯 SKILL PURPOSE

This skill enables an AI agent to build, extend, debug, and maintain the **Aarambh Institute Backend** — a Django REST Framework API server powering a JEE/NEET coaching institute platform with real-time chat, JWT authentication, WebSocket support, and a CMS for the landing page.

When this skill is active, the agent MUST follow every convention, pattern, and rule defined in this file. Deviation from these patterns breaks consistency across the codebase.

---

## 📦 TECH STACK (LOCKED — DO NOT CHANGE)

```
Language:           Python 3.11+
Framework:          Django 5.x + Django REST Framework (DRF) 3.15+
Real-time:          Django Channels 4.x + Daphne (ASGI server)
Authentication:     SimpleJWT (djangorestframework-simplejwt)
API Docs:           drf-spectacular (Swagger UI + ReDoc)
Database:           PostgreSQL 15+ (UUID native support)
File Storage:       Local (dev) → S3-compatible (prod)
Cache/Channel Layer: Redis 7+
Task Queue:         Celery + Redis (for SMS, emails, scheduled tasks)
SMS:                Twilio or MSG91 (pluggable via settings)
ORM:                Django ORM only (no raw SQL unless absolutely necessary)
Testing:            pytest + pytest-django + factory-boy
Linting:            ruff + black
Environment:        python-decouple (settings from .env)
```

---

## 🏗️ PROJECT STRUCTURE (MANDATORY)

```
aarambh_backend/
├── manage.py
├── requirements.txt
├── requirements-dev.txt
├── .env.example
├── pytest.ini
├── ruff.toml
│
├── config/                          ← Django project config
│   ├── __init__.py
│   ├── settings/
│   │   ├── base.py                  ← shared settings
│   │   ├── development.py           ← dev overrides
│   │   └── production.py            ← prod overrides
│   ├── urls.py                      ← root URL conf
│   ├── asgi.py                      ← ASGI + Channels routing
│   └── wsgi.py
│
├── apps/
│   ├── users/                       ← CustomUser, profiles, auth
│   ├── academics/                   ← Batches, Subjects, Enrollment
│   ├── notes/                       ← StudyMaterial, Downloads
│   ├── announcements/               ← Announcements, ReadReceipts
│   ├── performance/                 ← TestScores, Attendance
│   ├── chat/                        ← Conversations, Messages, Groups
│   ├── enquiries/                   ← Contact form, Follow-up logs
│   ├── content/                     ← Landing page CMS
│   ├── fees/                        ← FeeStructure, Payments
│   └── notifications/               ← In-app Notifications
│
└── utils/
    ├── permissions.py               ← Custom DRF permission classes
    ├── pagination.py                ← Standard pagination classes
    ├── validators.py                ← Phone, file type validators
    ├── renderers.py                 ← Standard API response format
    ├── mixins.py                    ← Reusable view mixins
    ├── sms.py                       ← SMS service abstraction
    └── storage.py                   ← File storage helpers
```

Each app MUST have this internal structure:
```
apps/someapp/
├── __init__.py
├── models.py          ← all models for this app
├── serializers.py     ← DRF serializers
├── views.py           ← DRF ViewSets / APIViews
├── urls.py            ← app-level URL patterns
├── permissions.py     ← app-specific permissions (if needed)
├── filters.py         ← django-filter FilterSets
├── signals.py         ← Django signals (post_save, etc.)
├── tasks.py           ← Celery tasks for this app
├── consumers.py       ← WebSocket consumers (chat app only)
├── admin.py           ← Django admin registration
└── tests/
    ├── __init__.py
    ├── test_models.py
    ├── test_serializers.py
    ├── test_views.py
    └── factories.py
```

---

## 📐 CODING CONVENTIONS (MUST FOLLOW)

### Models

```python
# RULE 1: Every model MUST have UUID primary key
import uuid
from django.db import models

class ExampleModel(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        db_index=True
    )

# RULE 2: Every model MUST have created_at and updated_at
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

# RULE 3: Soft delete pattern (never hard delete user-generated content)
    is_deleted = models.BooleanField(default=False, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

# RULE 4: Meta class always present
    class Meta:
        db_table = "appname_modelname"          # explicit table name
        ordering = ["-created_at"]              # default ordering
        verbose_name = "Example"
        verbose_name_plural = "Examples"
        indexes = [
            models.Index(fields=["field_name"]),
        ]

# RULE 5: Always define __str__
    def __str__(self):
        return f"ExampleModel({self.id})"
```

### Serializers

```python
# RULE: Always use explicit fields (never Meta fields = '__all__')
class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExampleModel
        fields = [
            "id", "field1", "field2",
            "created_at", "updated_at"
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

# RULE: Nested serializers use depth=1 or explicit nested class
# RULE: Sensitive fields (password, otp) NEVER in read responses
# RULE: write_only=True for any input-only field
```

### Views

```python
# RULE: Use ViewSets for CRUD resources
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

class ExampleViewSet(ModelViewSet):
    serializer_class = ExampleSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ExampleFilterSet
    search_fields = ["name", "description"]
    ordering_fields = ["created_at", "name"]
    pagination_class = StandardPagination

    def get_queryset(self):
        # RULE: Always scope queryset to authenticated user's access
        user = self.request.user
        if user.role == "admin":
            return ExampleModel.objects.filter(is_deleted=False)
        return ExampleModel.objects.filter(
            owner=user, is_deleted=False
        )

    # RULE: Custom actions for non-CRUD operations
    @action(detail=True, methods=["post"], url_path="custom-action")
    def custom_action(self, request, pk=None):
        pass
```

### URL Patterns

```python
# RULE: Always use DRF Router for ViewSets
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"examples", ExampleViewSet, basename="example")

# RULE: API versioning via URL prefix
# /api/v1/users/
# /api/v1/batches/
# /api/v1/notes/
```

### Standard API Response Format

```python
# ALL responses MUST follow this format via custom renderer:
# Success:
{
    "success": true,
    "data": { ... },           # or [] for lists
    "message": "Optional message",
    "pagination": {            # only for list responses
        "count": 100,
        "next": "url",
        "previous": null,
        "page_size": 20
    }
}

# Error:
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Human readable message",
        "details": { "field": ["error msg"] }
    }
}
```

### Permissions Pattern

```python
# utils/permissions.py — standard permission classes

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "student"

class IsTeacher(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "teacher"

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "admin"

class IsTeacherOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ["teacher", "admin"]

class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == "admin":
            return True
        return obj.owner == request.user  # adapt field name per model
```

---

## 🔌 WEBSOCKET CONVENTION (Chat App)

```python
# consumers.py pattern:
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # 1. Authenticate via JWT token in query params
        # 2. Get conversation/group ID from URL route
        # 3. Add to channel group
        # 4. Accept connection

    async def disconnect(self, close_code):
        # Remove from channel group
        # Update last_seen

    async def receive_json(self, content):
        # Route message type:
        # "chat.message" → save to DB → broadcast to group
        # "chat.typing" → broadcast typing indicator (no DB save)
        # "chat.read" → mark messages as read in DB

    async def chat_message(self, event):
        # Send to WebSocket client
        await self.send_json(event)

# WebSocket URL: ws://domain/ws/chat/{conversation_id}/
# WebSocket URL: ws://domain/ws/group/{batch_id}/
# Auth: ?token=<JWT access token> in query params
```

---

## 📋 SETTINGS CONVENTIONS

```python
# config/settings/base.py structure:
INSTALLED_APPS = [
    # Django built-ins first
    "django.contrib.admin",
    ...
    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "corsheaders",
    "channels",
    "django_filters",
    "drf_spectacular",
    "storages",
    # Local apps (always apps. prefix)
    "apps.users",
    "apps.academics",
    "apps.notes",
    "apps.announcements",
    "apps.performance",
    "apps.chat",
    "apps.enquiries",
    "apps.content",
    "apps.fees",
    "apps.notifications",
]

# JWT Settings (always define these):
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}

# DRF Settings (always define these):
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "utils.renderers.StandardJSONRenderer",
    ],
    "DEFAULT_PAGINATION_CLASS": "utils.pagination.StandardPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

# Channels Settings (always define these):
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("redis", 6379)],
        },
    },
}
```

---

## 🔐 SECURITY RULES (NON-NEGOTIABLE)

1. **Never expose raw file paths** — file downloads go through authenticated view
2. **Never return password fields** — not even hashed
3. **Never return OTP codes** — only "OTP sent" confirmation
4. **Always validate file MIME type** — not just extension
5. **Always paginate list endpoints** — never return all records
6. **Always scope querysets** — students see only their batch data
7. **Rate limit sensitive endpoints** — login (5/min), OTP (3/hour per phone)
8. **Soft delete only** — never hard delete notes, messages, scores
9. **JWT blacklist on logout** — use simplejwt blacklist app
10. **CORS configured** — only allowed origins in production

---

## ✅ DEFINITION OF DONE (Per Endpoint)

Before marking any endpoint as complete, verify:
- [ ] Model created with UUID PK and timestamps
- [ ] Migration created and applied
- [ ] Serializer with explicit fields (no `__all__`)
- [ ] ViewSet/View with correct permission class
- [ ] URL registered in router or urlconf
- [ ] Queryset scoped to user's access level
- [ ] Pagination applied on list views
- [ ] Filter/Search/Order working on list views
- [ ] drf-spectacular `@extend_schema` decorator added
- [ ] Test written (model + view minimum)
- [ ] Admin registered for the model

---

## 🚫 FORBIDDEN PATTERNS

```python
# NEVER do this:
Model.objects.all()                          # unscopeed query
fields = "__all__"                           # in serializers
except Exception: pass                       # silent failures
print("debug")                              # use logging
raw_password = user.password                 # expose password
os.system(...)                              # shell execution
eval(user_input)                            # code injection risk

# NEVER hard-delete user content:
instance.delete()                            # use soft delete instead

# NEVER put secrets in code:
SECRET_KEY = "hardcoded-secret"              # use .env
```

---

*Skill: Aarambh Institute Backend*
*Version: 1.0*
*Applies to: Django 5.x + DRF + Channels + JWT + PostgreSQL*

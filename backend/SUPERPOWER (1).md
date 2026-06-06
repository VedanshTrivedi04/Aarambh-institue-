# SUPERPOWER.md — Aarambh Institute Backend Agent Superpowers
## What This AI Agent Can Do — Capability Reference

---

## ⚡ WHAT THIS AGENT IS EMPOWERED TO DO

This document defines the full capabilities of the AI agent working on the Aarambh Institute backend. Each "superpower" is a complete, self-contained capability the agent can execute end-to-end.

---

## 🔋 SUPERPOWER 1: Scaffold a Complete Django App

**Trigger:** "Create the [app_name] app" or "Add [feature] module"

**Agent will:**
- Create folder `apps/[app_name]/` with all required files
- Write `models.py` with ALL fields, UUID PKs, timestamps, soft delete, Meta, `__str__`
- Write `serializers.py` with explicit fields, nested serializers, validation
- Write `views.py` with ViewSets, custom actions, proper permission classes
- Write `urls.py` with DRF router registration
- Write `admin.py` with ModelAdmin, list_display, search_fields, filters
- Write `filters.py` with FilterSet for all filterable fields
- Write `signals.py` for post_save hooks (notifications, cache invalidation)
- Write `tasks.py` for Celery async tasks (SMS, emails)
- Write `tests/factories.py` with factory_boy factories
- Write `tests/test_models.py` with basic model tests
- Write `tests/test_views.py` with authentication + CRUD tests
- Create migrations: `python manage.py makemigrations [app_name]`
- Register in `INSTALLED_APPS` in `config/settings/base.py`
- Include in root `config/urls.py`

---

## 🔋 SUPERPOWER 2: Generate Complete Database Migration

**Trigger:** "Add field [field] to [model]" or "Create model [name]"

**Agent will:**
- Add field to model with correct Django field type
- Add proper constraints (null, blank, default, db_index)
- Generate migration with descriptive name
- Verify migration doesn't break existing data (add default if needed)
- Update serializer to include new field
- Update admin list_display if needed
- Update `@extend_schema` docs if endpoint affected

---

## 🔋 SUPERPOWER 3: Build Complete Authentication System

**Trigger:** "Implement auth" or "Add login/OTP"

**Agent will:**
- Create `CustomUser` model extending `AbstractBaseUser + PermissionsMixin`
- Add `role` field: `student | teacher | parent | admin`
- Create `CustomUserManager` with `create_user` and `create_superuser`
- Configure `AUTH_USER_MODEL` in settings
- Implement Password Login endpoint (email/username + password → JWT pair)
- Implement OTP Login: generate 6-digit OTP → hash → save to `OTPRecord` → SMS → verify → JWT pair
- Implement Refresh Token endpoint
- Implement Logout (blacklist refresh token)
- Implement Forgot Password (generate token → email link → reset)
- Add rate limiting: 5 attempts/min for login, 3 OTP/hour per phone
- Write all tests for auth flows

---

## 🔋 SUPERPOWER 4: Implement Secure File Upload & Download

**Trigger:** "Add file upload for notes" or "Implement secure download"

**Agent will:**
- Create `FileField` with upload_to using UUID-based path (not predictable)
- Validate file MIME type on upload (not just extension)
- Validate file size (configurable limit, default 50MB)
- Store file with UUID name (original filename saved in `file_name` field)
- Create secure download endpoint: requires authentication → checks access → streams file
- Log each download in `DownloadLog` model
- Update `total_downloads` counter on `StudyMaterial`
- Return signed temporary URL or stream file (never expose raw storage path)
- Implement Celery task for async virus scanning hook (placeholder)

---

## 🔋 SUPERPOWER 5: Build Real-Time WebSocket Chat

**Trigger:** "Implement chat" or "Add WebSocket"

**Agent will:**
- Configure Django Channels in `config/asgi.py` with `ProtocolTypeRouter`
- Set up Redis channel layer in settings
- Write `ChatConsumer` (AsyncJsonWebsocketConsumer) handling:
  - JWT auth via query param token on connect
  - `chat.message` event: save to DB → broadcast to group
  - `chat.typing` event: broadcast without DB save
  - `chat.read` event: mark messages read in DB
  - `chat.online` event: update online status
- Write `GroupChatConsumer` for batch group chats
- Create channel group naming convention: `chat_{conversation_uuid}`, `group_{batch_uuid}`
- Add WebSocket URLs to `config/asgi.py` URLRouter
- Write async DB access using `database_sync_to_async`
- Ensure disconnect cleans up group membership

---

## 🔋 SUPERPOWER 6: Generate Bulk Operations

**Trigger:** "Add bulk student upload" or "CSV import for [model]"

**Agent will:**
- Create endpoint `POST /api/v1/users/bulk-upload/`
- Accept CSV file via multipart form
- Parse CSV using Python `csv` module (no pandas dependency)
- Validate each row: required fields, format, uniqueness
- Collect errors per row: `{row: 3, field: "phone", error: "Invalid format"}`
- For valid rows: create objects in single `bulk_create()` call (efficient)
- For newly created students: auto-generate password, queue welcome SMS
- Return response: `{created: 48, failed: 2, errors: [...]}`
- Provide downloadable error CSV with failed rows
- Run in Celery task for large files (> 50 rows)

---

## 🔋 SUPERPOWER 7: Build Analytics Endpoints

**Trigger:** "Add analytics for [role]" or "Performance report"

**Agent will:**
- Student analytics: scores over time, subject averages, attendance %, strong/weak topics, batch rank
- Teacher analytics: notes uploaded per month, student download rates, batch performance
- Admin analytics: enrollment trend (month-wise), total students/teachers/revenue, batch comparison
- All calculations done in Django ORM using aggregations (avoid Python loops on large datasets)
- Use `annotate()`, `aggregate()`, `values()`, `Count()`, `Avg()`, `Sum()`
- Cache expensive calculations with Redis (60 min TTL)
- Return chart-ready data format matching recharts expected props

---

## 🔋 SUPERPOWER 8: Setup API Documentation

**Trigger:** "Setup API docs" or "Add Swagger"

**Agent will:**
- Install and configure `drf-spectacular`
- Add `@extend_schema` to every ViewSet/APIView with:
  - `summary` (one line)
  - `description` (detailed explanation)
  - `tags` (group endpoints by module)
  - `request` (request body schema)
  - `responses` (success + error schemas)
  - `parameters` (query params for filters)
- Configure Swagger UI at `/api/docs/`
- Configure ReDoc at `/api/redoc/`
- Configure schema JSON at `/api/schema/`
- Add authentication to Swagger UI (JWT bearer)
- Generate schema file: `python manage.py spectacular --file schema.yml`

---

## 🔋 SUPERPOWER 9: Implement Notification System

**Trigger:** "Add notifications" or "Send SMS/email"

**Agent will:**
- Create `Notification` model with type, recipient, read status
- Create signal handlers that fire `Notification` on:
  - New note uploaded → notify batch students
  - New announcement → notify target students
  - Score added → notify that student
  - Fee overdue → notify student + parent
  - New chat message → notify recipient
  - New enquiry → notify admin
- Create Celery tasks for SMS (via `utils/sms.py` abstraction)
- SMS service interface: `send_sms(phone, message)` — pluggable backend
- Create notification list endpoint with pagination and unread count
- Create `mark_read` endpoint (single + all)
- WebSocket broadcast for real-time notification delivery

---

## 🔋 SUPERPOWER 10: Implement CMS Endpoints

**Trigger:** "Admin content update" or "Landing page CMS"

**Agent will:**
- Create endpoints for each content section (hero, about, faculty, toppers, testimonials, gallery, ticker)
- Public GET endpoints (no auth) for landing page to fetch content
- Admin-only PUT/PATCH endpoints to update content
- Image upload for faculty photos and gallery
- Content versioning: save previous version before update
- Reorder support: accept `display_order` field, return ordered by it
- Toggle active/inactive per item
- Timestamp: `updated_by`, `updated_at` on every save

---

## 🧠 AGENT DECISION RULES

When given any backend task, agent MUST:

1. **Check SKILL.md first** — ensure approach matches conventions
2. **Create model before view** — never write API without DB schema
3. **Write migration immediately** — never leave unmigrated models
4. **Add permission class before writing logic** — security first
5. **Add `@extend_schema`** — every new endpoint gets documented
6. **Scope queryset** — never return data user shouldn't see
7. **Write test** — at minimum one happy-path test per endpoint
8. **Handle errors explicitly** — try/except with proper HTTP status codes

---

## 📊 COMPLEXITY RATING (Agent Self-Assessment)

Before starting any task, agent estimates complexity:

| Rating | Criteria | Example |
|---|---|---|
| 🟢 Simple | 1 model, 1-2 endpoints, no async | Add a field to model |
| 🟡 Medium | 1-2 models, 3-5 endpoints, signals | Notes upload + download tracking |
| 🟠 Complex | 3+ models, 6+ endpoints, Celery tasks | Bulk upload with SMS |
| 🔴 Very Complex | Cross-app, WebSocket, real-time | Chat system with groups |

Agent declares complexity at start of response and breaks 🔴 tasks into sub-tasks.

---

*Superpower File: Aarambh Institute Backend Agent*
*Version: 1.0*
*Use with: SKILL.md + Agent Handover File*

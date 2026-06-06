"""
Aarambh Institute Backend — Development Settings
Overrides base.py for local development
"""
from .base import *  # noqa: F401, F403

DEBUG = True

# ─── Database (Neon PostgreSQL) ───────────────────────────────────────────────
import dj_database_url  # noqa: E402
from decouple import config  # noqa: E402

DATABASES = {
    "default": dj_database_url.parse(
        config(
            "DATABASE_URL",
            default="postgresql://neondb_owner:npg_MRL7pjJyEf3x@ep-old-leaf-ap0w4jjz-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require",
        ),
        conn_max_age=600,
        ssl_require=True,
    )
}

# ─── Dev-only: allow all hosts ────────────────────────────────────────────────
ALLOWED_HOSTS = ["*"]

# ─── Dev: serve media files directly ─────────────────────────────────────────
INTERNAL_IPS = ["127.0.0.1"]

# ─── Email: console backend ───────────────────────────────────────────────────
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# ─── CORS: allow all in dev ───────────────────────────────────────────────────
CORS_ALLOW_ALL_ORIGINS = True

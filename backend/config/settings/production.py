import os

import dj_database_url

from .base import *  # noqa: F403

DEBUG = False
ALLOWED_HOSTS = [
    host.strip() for host in os.environ.get("ALLOWED_HOSTS", "").split(",") if host.strip()
]
for host in ("healthcheck.railway.app", os.environ.get("RAILWAY_PUBLIC_DOMAIN", "").strip()):
    if host and host not in ALLOWED_HOSTS:
        ALLOWED_HOSTS.append(host)

DATABASES = {
    "default": dj_database_url.config(
        default=os.environ["DATABASE_URL"],
        conn_max_age=600,
        conn_health_checks=True,
    )
}

cloudinary_cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME")
cloudinary_api_key = os.environ.get("CLOUDINARY_API_KEY")
cloudinary_api_secret = os.environ.get("CLOUDINARY_API_SECRET")

if cloudinary_cloud_name and cloudinary_api_key and cloudinary_api_secret:
    DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"
    CLOUDINARY_STORAGE = {
        "CLOUD_NAME": cloudinary_cloud_name,
        "API_KEY": cloudinary_api_key,
        "API_SECRET": cloudinary_api_secret,
    }

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django.request": {
            "handlers": ["console"],
            "level": "ERROR",
            "propagate": False,
        },
    },
}
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
SECURE_HSTS_SECONDS = 31536000
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = "DENY"

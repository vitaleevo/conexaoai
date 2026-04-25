# Conexao AI — Django Backend

## Installation

```bash
cd conexao_ai_backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Fill in values
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## requirements.txt

```
django==5.2.13
djangorestframework==3.17.1
django-filter==25.2
djangorestframework-simplejwt==5.5.1
django-cors-headers==4.9.0
pillow==10.4
whitenoise==6.7
gunicorn==22.0
psycopg2-binary==2.9
dj-database-url==2.2
cloudinary==1.40
django-cloudinary-storage==0.3
python-dotenv==1.0
django-extensions==3.2
```

Note:
- The latest Django release on April 25, 2026 is `6.0.4`, but this project remains on `5.2.13` because the current JWT package line (`djangorestframework-simplejwt`) only declares Django support through `5.2`.

---

## config/settings/base.py

```python
from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY', 'change-me-in-production')
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'django_filters',
    'corsheaders',
    # Apps
    'apps.blog',
    'apps.accounts',
    'apps.newsletter',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

# Static & Media
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# DRF
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_THROTTLE_CLASSES': ['rest_framework.throttling.AnonRateThrottle'],
    'DEFAULT_THROTTLE_RATES': {'anon': '200/day'},
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
}

# JWT
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# CORS
CORS_ALLOWED_ORIGINS = os.environ.get(
    'CORS_ALLOWED_ORIGINS', 'http://localhost:3000'
).split(',')
```

---

## config/settings/development.py

```python
from .base import *

DEBUG = True
ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Media served locally in development
DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'
```

---

## config/settings/production.py

```python
from .base import *
import dj_database_url

DEBUG = False
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

# PostgreSQL — single env var switch from SQLite
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ['DATABASE_URL'],
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# Cloudinary media storage
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ['CLOUDINARY_CLOUD_NAME'],
    'API_KEY': os.environ['CLOUDINARY_API_KEY'],
    'API_SECRET': os.environ['CLOUDINARY_API_SECRET'],
}

# Static files via whitenoise
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Security headers
SECURE_HSTS_SECONDS = 31536000
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
```

---

## apps/blog/models.py

```python
from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model

User = get_user_model()


class Author(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='author')
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='authors/', blank=True)
    website = models.URLField(blank=True)
    twitter = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.username


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    meta_title = models.CharField(max_length=60, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Tag(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Post(models.Model):
    STATUS_CHOICES = [('draft', 'Draft'), ('published', 'Published')]

    # Core content
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    excerpt = models.TextField(max_length=300, blank=True)
    content = models.TextField()
    featured_image = models.ImageField(upload_to='posts/%Y/%m/', blank=True)
    featured_image_alt = models.CharField(max_length=200, blank=True)

    # Relations
    author = models.ForeignKey(Author, on_delete=models.PROTECT, related_name='posts')
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts'
    )
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')

    # Publication
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    published_at = models.DateTimeField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    reading_time = models.PositiveIntegerField(default=0, editable=False)

    # SEO fields
    meta_title = models.CharField(max_length=60, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    keywords = models.CharField(max_length=255, blank=True)
    canonical_url = models.URLField(blank=True)
    og_image = models.ImageField(upload_to='og/', blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'published_at']),
            models.Index(fields=['is_featured']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.meta_title:
            self.meta_title = self.title[:60]
        if not self.meta_description and self.excerpt:
            self.meta_description = self.excerpt[:160]
        # Auto-calculate reading time (avg 200 wpm)
        self.reading_time = max(1, len(self.content.split()) // 200)
        super().save(*args, **kwargs)
```

---

## apps/blog/serializers.py

```python
from rest_framework import serializers
from .models import Post, Category, Tag, Author
from django.db.models import Count


class AuthorSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.get_full_name')
    email = serializers.CharField(source='user.email')

    class Meta:
        model = Author
        fields = ['name', 'email', 'bio', 'avatar', 'website', 'twitter']


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'post_count',
                  'meta_title', 'meta_description']


class TagSerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'post_count']


class PostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing pages."""
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image',
            'featured_image_alt', 'author', 'category', 'tags',
            'published_at', 'reading_time', 'is_featured',
        ]


class PostDetailSerializer(PostListSerializer):
    """Full serializer including content and SEO fields."""

    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + [
            'content', 'meta_title', 'meta_description',
            'keywords', 'canonical_url', 'og_image', 'updated_at',
        ]
```

---

## apps/blog/views.py

```python
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from .models import Post, Category, Tag
from .serializers import (
    PostListSerializer, PostDetailSerializer,
    CategorySerializer, TagSerializer
)


class PostListView(generics.ListAPIView):
    queryset = Post.objects.filter(status='published').select_related(
        'author__user', 'category'
    ).prefetch_related('tags')
    serializer_class = PostListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'tags__slug', 'is_featured']
    search_fields = ['title', 'excerpt', 'content', 'tags__name']
    ordering_fields = ['published_at', 'reading_time']
    ordering = ['-published_at']

    @method_decorator(cache_page(60 * 5))  # 5-minute server-side cache
    def get(self, *args, **kwargs):
        return super().get(*args, **kwargs)


class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.filter(status='published').select_related(
        'author__user', 'category'
    ).prefetch_related('tags')
    serializer_class = PostDetailSerializer
    lookup_field = 'slug'


class PostSlugListView(generics.ListAPIView):
    """Returns only slugs — used by Next.js generateStaticParams."""
    queryset = Post.objects.filter(status='published').only('slug')
    serializer_class = PostListSerializer

    def list(self, request, *args, **kwargs):
        slugs = self.get_queryset().values('slug')
        return Response(list(slugs))


class RelatedPostsView(generics.ListAPIView):
    """
    Returns up to 4 related posts scored by:
    1. Number of shared tags (primary signal)
    2. Same category (secondary signal)
    Excludes the current post.
    """
    serializer_class = PostListSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        try:
            post = Post.objects.get(slug=slug, status='published')
        except Post.DoesNotExist:
            return Post.objects.none()

        tag_ids = post.tags.values_list('id', flat=True)
        return Post.objects.filter(
            status='published'
        ).filter(
            Q(category=post.category) | Q(tags__in=tag_ids)
        ).exclude(id=post.id).annotate(
            relevance=Count('tags', filter=Q(tags__in=tag_ids))
        ).order_by('-relevance', '-published_at').distinct()[:4]


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.annotate(
        post_count=Count('posts', filter=Q(posts__status='published'))
    ).filter(post_count__gt=0)
    serializer_class = CategorySerializer


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.annotate(
        post_count=Count('posts', filter=Q(posts__status='published'))
    ).filter(post_count__gt=0).order_by('-post_count')
    serializer_class = TagSerializer
```

---

## apps/blog/urls.py

```python
from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.PostListView.as_view(), name='post-list'),
    path('posts/slugs/', views.PostSlugListView.as_view(), name='post-slugs'),
    path('posts/<slug:slug>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/<slug:slug>/related/', views.RelatedPostsView.as_view(), name='post-related'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('tags/', views.TagListView.as_view(), name='tag-list'),
]
```

---

## config/urls.py

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.blog.urls')),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/newsletter/', include('apps.newsletter.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## apps/newsletter/models.py

```python
import uuid
from django.db import models


class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    confirmed = models.BooleanField(default=False)
    confirmation_token = models.UUIDField(default=uuid.uuid4, unique=True)

    class Meta:
        indexes = [models.Index(fields=['email', 'is_active'])]

    def __str__(self):
        return self.email
```

---

## Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120"]
```

---

## railway.toml

```toml
[build]
builder = "DOCKERFILE"

[deploy]
startCommand = "python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3"
healthcheckPath = "/api/posts/"
restartPolicyType = "ON_FAILURE"
```

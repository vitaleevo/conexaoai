from django.db.models import Count, Q
from django.utils.decorators import method_decorator
from django.utils import timezone
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, filters, generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def api_root(request):
    return Response({
        "name": "Conexão AI API",
        "version": "1.0.0",
        "endpoints": {
            "posts": request.build_absolute_uri('posts/'),
            "categories": request.build_absolute_uri('categories/'),
            "tags": request.build_absolute_uri('tags/'),
            "newsletter": "/api/newsletter/",
            "cms": "/api/cms/",
        }
    })

from .models import Category, Post, Tag
from .serializers import (
    CategorySerializer,
    PostDetailSerializer,
    PostListSerializer,
    TagSerializer,
)


class BlogPagination(PageNumberPagination):
    page_size_query_param = "page_size"
    max_page_size = 1000


class PostListView(generics.ListAPIView):
    queryset = Post.objects.filter(
        status="published",
        published_at__lte=timezone.now()
    ).select_related(
        "author__user", "category"
    ).prefetch_related("tags")
    serializer_class = PostListSerializer
    pagination_class = BlogPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category__slug", "tags__slug", "is_featured"]
    search_fields = ["title", "excerpt", "content", "tags__name"]
    ordering_fields = ["published_at", "reading_time"]
    ordering = ["-published_at"]

    @method_decorator(cache_page(60 * 5))
    def get(self, *args, **kwargs):
        return super().get(*args, **kwargs)


class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.filter(
        status="published",
        published_at__lte=timezone.now()
    ).select_related(
        "author__user", "category"
    ).prefetch_related("tags")
    serializer_class = PostDetailSerializer
    lookup_field = "slug"

    @method_decorator(cache_page(60 * 15))
    def get(self, *args, **kwargs):
        return super().get(*args, **kwargs)


class PostSlugListView(generics.ListAPIView):
    queryset = Post.objects.filter(
        status="published",
        published_at__lte=timezone.now()
    ).only("slug")
    pagination_class = None

    @method_decorator(cache_page(60 * 60))
    def list(self, request, *args, **kwargs):
        slugs = self.get_queryset().values_list("slug", flat=True)
        return Response({"slugs": list(slugs)})


class RelatedPostsView(generics.ListAPIView):
    serializer_class = PostListSerializer
    pagination_class = None

    def get_queryset(self):
        slug = self.kwargs["slug"]
        try:
            post = Post.objects.get(
                slug=slug, 
                status="published",
                published_at__lte=timezone.now()
            )
        except Post.DoesNotExist:
            return Post.objects.none()

        tag_ids = post.tags.values_list("id", flat=True)
        return (
            Post.objects.filter(
                status="published",
                published_at__lte=timezone.now()
            )
            .filter(Q(category=post.category) | Q(tags__in=tag_ids))
            .exclude(id=post.id)
            .annotate(relevance=Count("tags", filter=Q(tags__in=tag_ids)))
            .select_related("author__user", "category")
            .prefetch_related("tags")
            .order_by("-relevance", "-published_at")
            .distinct()[:4]
        )

    @method_decorator(cache_page(60 * 15))
    def get(self, *args, **kwargs):
        return super().get(*args, **kwargs)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.annotate(
        post_count=Count("posts", filter=Q(posts__status="published", posts__published_at__lte=timezone.now()))
    ).filter(post_count__gt=0)
    serializer_class = CategorySerializer
    pagination_class = None

    @method_decorator(cache_page(60 * 60))
    def get(self, *args, **kwargs):
        return super().get(*args, **kwargs)


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.annotate(
        post_count=Count("posts", filter=Q(posts__status="published", posts__published_at__lte=timezone.now()))
    ).filter(post_count__gt=0).order_by("-post_count")
    serializer_class = TagSerializer
    pagination_class = None

    @method_decorator(cache_page(60 * 60))
    def get(self, *args, **kwargs):
        return super().get(*args, **kwargs)

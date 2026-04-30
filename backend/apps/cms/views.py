from django.utils import timezone
from datetime import timedelta
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from apps.blog.models import Post, Category, Tag, Author
from apps.newsletter.models import Subscriber
from .models import MediaAsset, EditorialReview
from .serializers import (
    PostListSerializer, PostDetailSerializer, 
    CategorySerializer, TagSerializer, 
    AuthorSerializer, UserSerializer,
    MediaAssetSerializer, SubscriberSerializer
)
from .permissions import IsAdminUser, IsManagerUser, IsCmsRegularUser
import hashlib
import hmac
import time
import os

class IsCmsUser(permissions.BasePermission):
    """
    Allows access only to authenticated users with a valid CMS role.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        return hasattr(request.user, 'author') and request.user.author.role in ['admin', 'manager', 'editor', 'author']

@api_view(['GET'])
@permission_classes([IsCmsUser])
def dashboard_stats(request):
    """
    Returns aggregated stats for the CMS dashboard.
    """
    now = timezone.now()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)

    total_posts = Post.objects.count()
    published_posts = Post.objects.filter(status='published').count()
    draft_posts = Post.objects.filter(status='draft').count()
    scheduled_posts = Post.objects.filter(status='scheduled').count()
    review_posts = Post.objects.filter(status='review').count()

    posts_this_week = Post.objects.filter(created_at__gte=week_ago).count()
    posts_this_month = Post.objects.filter(created_at__gte=month_ago).count()

    total_categories = Category.objects.count()
    active_categories = Category.objects.filter(is_active=True).count() if hasattr(Category, 'is_active') else total_categories

    total_tags = Tag.objects.count()

    total_subscribers = Subscriber.objects.count()
    active_subscribers = Subscriber.objects.filter(is_active=True, confirmed=True).count()
    subscribers_this_month = Subscriber.objects.filter(subscribed_at__gte=month_ago).count()

    total_media = MediaAsset.objects.count()

    recent_posts = Post.objects.select_related('category', 'author__user').order_by('-created_at')[:5]

    return Response({
        'posts': {
            'total': total_posts,
            'published': published_posts,
            'draft': draft_posts,
            'scheduled': scheduled_posts,
            'review': review_posts,
            'this_week': posts_this_week,
            'this_month': posts_this_month,
        },
        'categories': {
            'total': total_categories,
            'active': active_categories,
        },
        'tags': {
            'total': total_tags,
        },
        'subscribers': {
            'total': total_subscribers,
            'active': active_subscribers,
            'this_month': subscribers_this_month,
        },
        'media': {
            'total': total_media,
        },
        'recent_posts': [
            {
                'id': p.id,
                'title': p.title,
                'status': p.status,
                'created_at': p.created_at.isoformat(),
                'published_at': p.published_at.isoformat() if p.published_at else None,
                'author': p.author.user.get_full_name() if p.author and p.author.user else 'Sem autor',
                'category': p.category.name if p.category else None,
            }
            for p in recent_posts
        ],
    })

@api_view(['GET'])
@permission_classes([IsCmsUser])
def current_cms_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [IsCmsRegularUser]
    filterset_fields = ['status', 'category', 'author', 'is_featured']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Post.objects.all().select_related('category', 'author__user')
        
        # Admin, Manager and Editor see everything
        if hasattr(user, 'author') and user.author.role in ['admin', 'manager', 'editor']:
            return Post.objects.all().select_related('category', 'author__user')
        
        # Regular authors only see their own posts
        if hasattr(user, 'author') and user.author.role == 'author':
            return Post.objects.filter(author=user.author).select_related('category', 'author__user')
            
        return Post.objects.none()

    def perform_create(self, serializer):
        # Auto-assign author if not provided and user has author profile
        if 'author' not in serializer.validated_data and hasattr(self.request.user, 'author'):
            serializer.save(author=self.request.user.author)
        else:
            serializer.save()

    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        return PostDetailSerializer

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        post = self.get_object()
        history_data = post.history.all()
        data = []
        for h in history_data:
            data.append({
                'history_id': h.history_id,
                'history_date': h.history_date,
                'history_change_reason': h.history_change_reason,
                'history_type': h.history_type,
                'history_user': h.history_user.username if h.history_user else None,
                'status': h.status,
                'title': h.title,
            })
        return Response(data)

    @action(detail=False, methods=['get'])
    def activity(self, request):
        from django.db.models.functions import TruncDate
        from django.db.models import Count
        import datetime

        one_year_ago = datetime.date.today() - datetime.timedelta(days=365)
        
        activity = Post.objects.filter(created_at__date__gte=one_year_ago) \
            .annotate(date=TruncDate('created_at')) \
            .values('date') \
            .annotate(count=Count('id')) \
            .order_by('date')
            
        return Response(list(activity))

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsManagerUser]
    search_fields = ['name']

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsManagerUser]
    search_fields = ['name']

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all().select_related('user')
    serializer_class = AuthorSerializer
    permission_classes = [IsManagerUser]
    search_fields = ['user__first_name', 'user__last_name', 'user__username']

class MediaAssetViewSet(viewsets.ModelViewSet):
    queryset = MediaAsset.objects.all().order_by('-created_at')
    serializer_class = MediaAssetSerializer
    permission_classes = [IsCmsRegularUser]

class SubscriberViewSet(viewsets.ModelViewSet):
    queryset = Subscriber.objects.all().order_by('-subscribed_at')
    serializer_class = SubscriberSerializer
    permission_classes = [IsAdminUser]
    search_fields = ['email', 'name']
    filterset_fields = ['is_active', 'confirmed']

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def track_click(request):
    """
    Public endpoint to track user clicks for the heatmap.
    """
    path = request.data.get('path', '/')
    x = request.data.get('x_percent')
    y = request.data.get('y_percent')
    device = request.data.get('device_type', 'desktop')
    browser = request.data.get('browser', 'unknown')
    
    if x is not None and y is not None:
        from .models import ClickEvent
        ClickEvent.objects.create(
            path=path, 
            x_percent=x, 
            y_percent=y,
            device_type=device,
            browser=browser
        )
        return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsCmsUser])
def click_stats(request):
    """
    CMS endpoint to get click data for visualization.
    """
    from .models import ClickEvent
    path = request.query_params.get('path', '/')
    # Return last 1000 clicks for the specific path
    clicks = ClickEvent.objects.filter(path=path)[:1000].values('x_percent', 'y_percent')
    return Response(list(clicks))


@api_view(['GET'])
@permission_classes([IsCmsRegularUser])
def cloudinary_upload_signature(request):
    """
    Generates a signed upload signature for direct Cloudinary uploads from the frontend.
    This allows the frontend to upload directly to Cloudinary without exposing the API secret.
    
    Query params:
    - folder: Target folder in Cloudinary (e.g., 'posts', 'authors')
    - resource_type: 'image', 'video', or 'raw' (default: 'image')
    """
    cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME')
    api_key = os.environ.get('CLOUDINARY_API_KEY')
    api_secret = os.environ.get('CLOUDINARY_API_SECRET')

    if not cloud_name or not api_key or not api_secret:
        return Response(
            {"detail": "Cloudinary credentials not configured."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    folder = request.query_params.get('folder', 'cms')
    resource_type = request.query_params.get('resource_type', 'image')

    if resource_type not in ('image', 'video', 'raw'):
        return Response(
            {"detail": "Invalid resource_type. Must be 'image', 'video', or 'raw'."},
            status=status.HTTP_400_BAD_REQUEST
        )

    timestamp = int(time.time())

    params_to_sign = {
        'timestamp': timestamp,
        'folder': folder,
    }

    query_string = '&'.join(f"{k}={v}" for k, v in sorted(params_to_sign.items()))
    signature = hashlib.sha1(f"{query_string}{api_secret}".encode('utf-8')).hexdigest()

    return Response({
        'cloud_name': cloud_name,
        'api_key': api_key,
        'timestamp': timestamp,
        'signature': signature,
        'folder': folder,
        'resource_type': resource_type,
        'upload_url': f'https://api.cloudinary.com/v1_1/{cloud_name}/{resource_type}/upload',
    })


@api_view(['POST'])
@permission_classes([IsCmsRegularUser])
def submit_for_review(request, post_id):
    """
    Submit a post for editorial review. Changes status to 'review'.
    """
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    if post.status == "published":
        return Response({"detail": "Published posts cannot be submitted for review."}, status=status.HTTP_400_BAD_REQUEST)

    post.status = "review"
    post.save(update_fields=["status"])

    comment = request.data.get("comment", "")
    if comment:
        EditorialReview.objects.create(post=post, reviewer=request.user, status="pending", comment=comment)
    else:
        EditorialReview.objects.create(post=post, reviewer=request.user, status="pending")

    return Response({"detail": "Post submitted for review.", "status": post.status}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsManagerUser])
def review_post(request, post_id):
    """
    Approve or reject a post under review.
    Required data: status ('approved' or 'rejected'), optional: comment
    """
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    action_status = request.data.get("status")
    if action_status not in ("approved", "rejected"):
        return Response({"detail": "Invalid status. Use 'approved' or 'rejected'."}, status=status.HTTP_400_BAD_REQUEST)

    comment = request.data.get("comment", "")

    review = EditorialReview.objects.create(
        post=post,
        reviewer=request.user,
        status=action_status,
        comment=comment,
    )

    if action_status == "approved":
        post.status = "published"
        if not post.published_at:
            post.published_at = timezone.now()
    else:
        post.status = "draft"

    post.save(update_fields=["status", "published_at"])

    return Response({
        "detail": f"Post {action_status}.",
        "review_id": review.id,
        "post_status": post.status,
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsCmsRegularUser])
def post_reviews(request, post_id):
    """
    Get all reviews for a specific post.
    """
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    reviews = EditorialReview.objects.filter(post=post).select_related("reviewer")
    data = [
        {
            "id": r.id,
            "reviewer": r.reviewer.get_full_name() or r.reviewer.username if r.reviewer else "Unknown",
            "status": r.status,
            "comment": r.comment,
            "created_at": r.created_at.isoformat(),
        }
        for r in reviews
    ]

    return Response(data)


@api_view(['GET'])
@permission_classes([IsManagerUser])
def pending_reviews(request):
    """
    Get all posts pending review (for editors/managers).
    """
    pending_posts = Post.objects.filter(status="review").select_related("author__user", "category")
    data = [
        {
            "id": p.id,
            "title": p.title,
            "slug": p.slug,
            "author": p.author.user.get_full_name() if p.author and p.author.user else "Unknown",
            "category": p.category.name if p.category else None,
            "created_at": p.created_at.isoformat(),
            "updated_at": p.updated_at.isoformat(),
        }
        for p in pending_posts
    ]

    return Response(data)

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from apps.blog.models import Post, Category, Tag, Author
from apps.newsletter.models import Subscriber
from .models import MediaAsset
from .serializers import (
    PostListSerializer, PostDetailSerializer, 
    CategorySerializer, TagSerializer, 
    AuthorSerializer, UserSerializer,
    MediaAssetSerializer, SubscriberSerializer
)

class IsCmsUser(permissions.BasePermission):
    """
    Allows access only to staff or superuser users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)

@api_view(['GET'])
@permission_classes([IsCmsUser])
def current_cms_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().select_related('category', 'author__user')
    permission_classes = [IsCmsUser]
    filterset_fields = ['status', 'category', 'author', 'is_featured']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'created_at', 'title']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return PostListSerializer
        return PostDetailSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsCmsUser]
    search_fields = ['name']

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsCmsUser]
    search_fields = ['name']

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all().select_related('user')
    serializer_class = AuthorSerializer
    permission_classes = [IsCmsUser]
    search_fields = ['user__first_name', 'user__last_name', 'user__username']

class MediaAssetViewSet(viewsets.ModelViewSet):
    queryset = MediaAsset.objects.all().order_by('-created_at')
    serializer_class = MediaAssetSerializer
    permission_classes = [IsCmsUser]

class SubscriberViewSet(viewsets.ModelViewSet):
    queryset = Subscriber.objects.all().order_by('-subscribed_at')
    serializer_class = SubscriberSerializer
    permission_classes = [IsCmsUser]
    search_fields = ['email', 'name']
    filterset_fields = ['is_active', 'confirmed']

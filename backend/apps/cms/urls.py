from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    PostViewSet, CategoryViewSet, TagViewSet, 
    AuthorViewSet, MediaAssetViewSet, SubscriberViewSet,
    current_cms_user, dashboard_stats, track_click, click_stats,
    cloudinary_upload_signature, submit_for_review, review_post,
    post_reviews, pending_reviews
)

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='cms-posts')
router.register(r'categories', CategoryViewSet, basename='cms-categories')
router.register(r'tags', TagViewSet, basename='cms-tags')
router.register(r'authors', AuthorViewSet, basename='cms-authors')
router.register(r'media', MediaAssetViewSet, basename='cms-media')
router.register(r'newsletter', SubscriberViewSet, basename='cms-newsletter')

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='cms-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='cms-refresh'),
    path('me/', current_cms_user, name='cms-me'),
    path('stats/', dashboard_stats, name='cms-stats'),
    path('upload-signature/', cloudinary_upload_signature, name='cms-upload-signature'),
    path('track-click/', track_click, name='cms-track-click'),
    path('click-stats/', click_stats, name='cms-click-stats'),
    path('workflow/pending/', pending_reviews, name='cms-pending-reviews'),
    path('posts/<int:post_id>/review/', review_post, name='cms-review-post'),
    path('posts/<int:post_id>/reviews/', post_reviews, name='cms-post-reviews'),
    path('posts/<int:post_id>/submit-review/', submit_for_review, name='cms-submit-review'),
    path('', include(router.urls)),
]

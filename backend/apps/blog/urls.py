from django.urls import path

from . import views

urlpatterns = [
    path("posts/", views.PostListView.as_view(), name="post-list"),
    path("posts/slugs/", views.PostSlugListView.as_view(), name="post-slugs"),
    path("posts/<slug:slug>/", views.PostDetailView.as_view(), name="post-detail"),
    path("posts/<slug:slug>/related/", views.RelatedPostsView.as_view(), name="post-related"),
    path("categories/", views.CategoryListView.as_view(), name="category-list"),
    path("tags/", views.TagListView.as_view(), name="tag-list"),
]

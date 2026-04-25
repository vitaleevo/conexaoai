from django import forms
from django.contrib import admin

from .models import Author, Category, Post, Tag


class PostAdminForm(forms.ModelForm):
    content = forms.CharField(widget=forms.Textarea(attrs={"rows": 24}))
    excerpt = forms.CharField(widget=forms.Textarea(attrs={"rows": 5}), required=False)

    class Meta:
        model = Post
        fields = "__all__"


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ("user", "website", "twitter")
    search_fields = ("user__username", "user__first_name", "user__last_name", "user__email")


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    form = PostAdminForm
    list_display = ("title", "category", "author", "status", "is_featured", "published_at")
    list_filter = ("status", "is_featured", "category", "tags")
    search_fields = ("title", "excerpt", "content")
    prepopulated_fields = {"slug": ("title",)}
    autocomplete_fields = ("author",)
    filter_horizontal = ("tags",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}

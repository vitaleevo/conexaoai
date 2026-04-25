from django.contrib import admin

from .models import AuthorProfile


@admin.register(AuthorProfile)
class AuthorProfileAdmin(admin.ModelAdmin):
    list_display = ("display_name", "user", "website")
    search_fields = ("display_name", "user__username", "user__email")

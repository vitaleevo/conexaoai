from django.contrib import admin

from .models import Subscriber


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "confirmed", "is_active", "subscribed_at")
    search_fields = ("email", "name")
    list_filter = ("confirmed", "is_active")

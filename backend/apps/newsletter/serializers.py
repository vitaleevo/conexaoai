from rest_framework import serializers

from .models import Subscriber


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ["email", "name", "region", "is_active", "subscribed_at", "confirmed"]
        read_only_fields = ["is_active", "subscribed_at", "confirmed"]


class SubscriptionActionSerializer(serializers.Serializer):
    token = serializers.UUIDField()

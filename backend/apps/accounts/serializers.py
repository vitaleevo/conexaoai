from django.contrib.auth.models import User
from rest_framework import serializers

from .models import AuthorProfile


class AuthorProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = AuthorProfile
        fields = ["display_name", "bio", "avatar", "website", "email"]


class UserSerializer(serializers.ModelSerializer):
    author_profile = AuthorProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "author_profile"]

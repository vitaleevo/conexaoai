from django.contrib.auth.models import User
from rest_framework import serializers

from apps.blog.models import Author


class AuthorSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Author
        fields = ["bio", "avatar", "website", "twitter", "linkedin", "credentials", "email"]


class UserSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "author"]

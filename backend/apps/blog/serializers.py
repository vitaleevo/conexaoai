from rest_framework import serializers

from .models import Author, Category, Post, Tag


class AuthorSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="user.get_full_name")
    email = serializers.CharField(source="user.email")

    class Meta:
        model = Author
        fields = ["name", "email", "bio", "avatar", "website", "twitter"]


class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "post_count",
            "meta_title",
            "meta_description",
        ]


class TagSerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Tag
        fields = ["id", "name", "slug", "post_count"]


class PostListSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "featured_image",
            "featured_image_alt",
            "author",
            "category",
            "tags",
            "published_at",
            "reading_time",
            "is_featured",
        ]


class PostDetailSerializer(PostListSerializer):
    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + [
            "content",
            "meta_title",
            "meta_description",
            "keywords",
            "canonical_url",
            "og_image",
            "updated_at",
        ]

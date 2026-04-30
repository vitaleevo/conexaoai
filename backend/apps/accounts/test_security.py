import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import identify_hasher
from rest_framework.test import APIClient
from apps.blog.models import Author

User = get_user_model()

@pytest.mark.django_db
def test_password_hashing_uses_argon2():
    """
    Test that new users' passwords are hashed using Argon2 by default.
    """
    user = User.objects.create_user(username="security_test", password="SecurePassword123!")
    hasher = identify_hasher(user.password)
    assert hasher.algorithm == "argon2"

@pytest.mark.django_db
def test_user_permissions_rbac():
    """
    Test basic RBAC (Admin vs Regular User).
    """
    admin = User.objects.create_superuser(username="admin_test", password="AdminPassword123!", email="admin@test.com")
    
    # Create a regular user with Author profile
    user_author = User.objects.create_user(username='regularuser', password='password123')
    Author.objects.create(user=user_author, role='author')
    
    assert admin.is_staff is True
    assert admin.is_superuser is True
    assert user_author.is_staff is False
    assert user_author.is_superuser is False
    
    # Test Role
    assert user_author.author.role == 'author'

from django.contrib.auth.models import User
from django.db import models


class AuthorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="author_profile")
    display_name = models.CharField(max_length=120)
    bio = models.TextField(blank=True)
    avatar = models.URLField(blank=True)
    website = models.URLField(blank=True)

    def __str__(self) -> str:
        return self.display_name or self.user.get_username()

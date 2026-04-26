import uuid

from django.db import models


class Subscriber(models.Model):
    REGION_CHOICES = [
        ("global", "Global"),
        ("america", "America"),
        ("europe", "Europe"),
        ("asia", "Asia"),
    ]
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=10, choices=REGION_CHOICES, default="global")
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    confirmed = models.BooleanField(default=False)
    confirmation_token = models.UUIDField(default=uuid.uuid4, unique=True)

    class Meta:
        indexes = [models.Index(fields=["email", "is_active"])]

    def __str__(self):
        return self.email

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class MediaAsset(models.Model):
    file = models.ImageField(upload_to="library/")
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name


class ClickEvent(models.Model):
    path = models.CharField(max_length=255)
    x_percent = models.FloatField()
    y_percent = models.FloatField()
    device_type = models.CharField(max_length=50, blank=True)
    browser = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']


class EditorialReview(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    post = models.ForeignKey("blog.Post", on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="reviews_given")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")
    comment = models.TextField(blank=True, help_text="Feedback for the author")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Review for '{self.post.title}' by {self.reviewer} [{self.status}]"

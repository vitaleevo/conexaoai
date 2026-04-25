from django.db import models

class MediaAsset(models.Model):
    file = models.ImageField(upload_to="library/")
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name

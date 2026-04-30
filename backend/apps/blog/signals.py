from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Post, Category, Tag

@receiver([post_save, post_delete], sender=Post)
@receiver([post_save, post_delete], sender=Category)
@receiver([post_save, post_delete], sender=Tag)
def clear_blog_cache(sender, **kwargs):
    """
    Clears the cache whenever a post, category or tag is modified.
    This ensures the frontend always sees fresh content.
    """
    # Using a simple clear() for now as it's a dedicated blog cache.
    # In more complex systems, we would use more granular invalidation.
    cache.clear()

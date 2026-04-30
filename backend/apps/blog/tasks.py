from celery import shared_task
from django.utils import timezone
from apps.blog.models import Post
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def publish_scheduled_posts(self):
    """
    Checks for posts with status='scheduled' and published_at <= now,
    and publishes them by updating status to 'published'.
    Runs every 5 minutes via Celery Beat.
    """
    now = timezone.now()
    posts_to_publish = Post.objects.filter(
        status="scheduled",
        published_at__lte=now
    )

    count = posts_to_publish.count()
    if count == 0:
        return {"status": "ok", "published": 0, "message": "No scheduled posts to publish"}

    updated = posts_to_publish.update(status="published")

    for post in posts_to_publish:
        logger.info(f"Published scheduled post: {post.title} (id={post.id})")

    return {
        "status": "ok",
        "published": updated,
        "message": f"Successfully published {updated} scheduled posts"
    }

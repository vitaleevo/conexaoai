import logging

from celery import shared_task

from .models import Subscriber

logger = logging.getLogger(__name__)


@shared_task
def send_subscription_confirmation(subscriber_id: int) -> None:
    try:
        subscriber = Subscriber.objects.get(id=subscriber_id)
    except Subscriber.DoesNotExist:
        logger.warning("Subscriber %s no longer exists.", subscriber_id)
        return

    logger.info(
        "Newsletter confirmation prepared for %s with token %s",
        subscriber.email,
        subscriber.confirmation_token,
    )

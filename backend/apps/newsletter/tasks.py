import logging
from datetime import datetime
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from celery import shared_task

from .models import Subscriber

logger = logging.getLogger(__name__)


def _get_confirmation_url(token: str) -> str:
    base_url = getattr(settings, "SITE_URL", "https://conexao.ai")
    return f"{base_url}/newsletter/confirm/{token}"


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_subscription_confirmation(self, subscriber_id: int) -> None:
    """
    Sends a confirmation email to a new newsletter subscriber.
    Retries up to 3 times with a 60-second delay between attempts.
    """
    try:
        subscriber = Subscriber.objects.get(id=subscriber_id)
    except Subscriber.DoesNotExist:
        logger.warning("Subscriber %s no longer exists.", subscriber_id)
        return

    context = {
        "subscriber_name": subscriber.name or "Assinante",
        "confirmation_url": _get_confirmation_url(str(subscriber.confirmation_token)),
        "year": datetime.now().year,
    }

    subject = "Confirme sua inscrição na ConexãoAI Newsletter"

    try:
        html_content = render_to_string("newsletter/confirmation_email.html", context)
        text_content = strip_tags(html_content)
    except Exception:
        logger.error("Failed to render email template for subscriber %s", subscriber_id, exc_info=True)
        fallback_text = (
            f"Olá {subscriber.name or 'Assinante'},\n\n"
            f"Confirme sua inscrição clicando neste link:\n"
            f"{_get_confirmation_url(str(subscriber.confirmation_token))}\n\n"
            f"Se você não se inscreu, ignore este email."
        )
        html_content = f"<pre>{fallback_text}</pre>"
        text_content = fallback_text

    try:
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[subscriber.email],
            reply_to=[settings.DEFAULT_FROM_EMAIL],
        )
        email.attach_alternative(html_content, "text/html")
        email.send(fail_silently=False)

        logger.info(
            "Newsletter confirmation email sent to %s (subscriber_id=%s)",
            subscriber.email,
            subscriber_id,
        )
    except Exception as exc:
        logger.error(
            "Failed to send confirmation email to %s (subscriber_id=%s)",
            subscriber.email,
            subscriber_id,
            exc_info=True,
        )
        self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_newsletter_broadcast(self, subscriber_ids: list[int], subject: str, html_content: str) -> dict:
    """
    Sends a newsletter broadcast to a list of subscribers.
    Returns a summary of sent/failed emails.
    """
    sent = 0
    failed = 0
    errors = []

    subscribers = Subscriber.objects.filter(
        id__in=subscriber_ids,
        is_active=True,
        confirmed=True,
    )

    text_content = strip_tags(html_content)

    for subscriber in subscribers:
        try:
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[subscriber.email],
                reply_to=[settings.DEFAULT_FROM_EMAIL],
            )
            personalized_html = html_content.replace(
                "{{ subscriber_name }}",
                subscriber.name or "Assinante",
            )
            email.attach_alternative(personalized_html, "text/html")
            email.send(fail_silently=False)
            sent += 1
        except Exception as exc:
            failed += 1
            errors.append(f"{subscriber.email}: {str(exc)}")
            logger.error("Failed to send newsletter to %s", subscriber.email, exc_info=True)

    result = {
        "total": subscribers.count(),
        "sent": sent,
        "failed": failed,
        "errors": errors[:10],
    }

    if failed > 0:
        self.retry(exc=Exception(f"{failed} emails failed"))

    return result

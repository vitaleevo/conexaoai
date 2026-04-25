import logging

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Subscriber
from .serializers import SubscriberSerializer, SubscriptionActionSerializer
from .tasks import send_subscription_confirmation

logger = logging.getLogger(__name__)


class SubscribeAPIView(generics.CreateAPIView):
    serializer_class = SubscriberSerializer
    queryset = Subscriber.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber, created = Subscriber.objects.get_or_create(
            email=serializer.validated_data["email"],
            defaults={"name": serializer.validated_data.get("name", "")},
        )
        if not created:
            subscriber.is_active = True
            if serializer.validated_data.get("name"):
                subscriber.name = serializer.validated_data["name"]
            subscriber.save(update_fields=["is_active", "name"])
        else:
            try:
                send_subscription_confirmation.delay(subscriber.id)
            except Exception:
                logger.warning(
                    "Celery worker/broker unavailable. Continuing without async dispatch.",
                    exc_info=True,
                )

        payload = SubscriberSerializer(subscriber).data
        payload["confirmation_token"] = str(subscriber.confirmation_token)
        return Response(payload, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class ConfirmSubscriptionAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = SubscriptionActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber = generics.get_object_or_404(
            Subscriber, confirmation_token=serializer.validated_data["token"]
        )
        subscriber.confirmed = True
        subscriber.save(update_fields=["confirmed"])
        return Response({"detail": "Subscription confirmed."})


class UnsubscribeAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = SubscriptionActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        subscriber = generics.get_object_or_404(
            Subscriber, confirmation_token=serializer.validated_data["token"]
        )
        subscriber.is_active = False
        subscriber.save(update_fields=["is_active"])
        return Response({"detail": "Subscription cancelled."})

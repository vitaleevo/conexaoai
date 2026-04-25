from django.urls import path

from .views import ConfirmSubscriptionAPIView, SubscribeAPIView, UnsubscribeAPIView

urlpatterns = [
    path("subscribe/", SubscribeAPIView.as_view(), name="newsletter-subscribe"),
    path("confirm/", ConfirmSubscriptionAPIView.as_view(), name="newsletter-confirm"),
    path("unsubscribe/", UnsubscribeAPIView.as_view(), name="newsletter-unsubscribe"),
]

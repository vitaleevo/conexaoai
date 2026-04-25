from django.urls import path

from .views import (
    AuthorTokenObtainPairView,
    AuthorTokenRefreshView,
    AuthorTokenVerifyView,
)

urlpatterns = [
    path("token/", AuthorTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", AuthorTokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", AuthorTokenVerifyView.as_view(), name="token_verify"),
]

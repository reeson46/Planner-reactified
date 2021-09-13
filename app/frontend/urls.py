from django.urls import path

from .views import index

urlpatterns = [
    path("", index),
    path("login", index),
    path("signup", index),
    path("signup-successful", index),
    path("account/profile", index),
    path("account/verify/<str:uid>/<str:token>", index),
    path("account/reset-password", index),
    path("account/reset-password-confirm/<str:uid>/<str:token>", index),
]

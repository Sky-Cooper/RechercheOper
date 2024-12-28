from django.urls import path
from .views import FordBellmanAPIView

urlpatterns = [
    path("ford-bellman/", FordBellmanAPIView.as_view(), name="ford-bellman"),
]

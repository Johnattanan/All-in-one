from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ExpenseViewSet

router = DefaultRouter()
router.register(r"", ExpenseViewSet, basename="depense")

urlpatterns = [
    path("", include(router.urls)),
]

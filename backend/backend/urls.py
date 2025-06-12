from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView)

urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("admin/", admin.site.urls),
    path("api/depenses/", include("depense.urls")),
    path("api/todos/", include("todos.urls")),
    path("api/notes/", include("notes.urls")),
    path("api/", include("user.urls")),
]

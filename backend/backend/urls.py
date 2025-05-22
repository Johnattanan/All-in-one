from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/depenses/', include('depense.urls')),
    path('api/todos/', include('todos.urls')),
    path('api/notes/', include('notes.urls')),
]

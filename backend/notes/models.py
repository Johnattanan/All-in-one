from django.contrib.auth.models import User
from django.db import models


class Note(models.Model):
    user = models.ForeignKey(
        "auth.User", on_delete=models.CASCADE, related_name="notes"
    )
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

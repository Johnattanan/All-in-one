from django.contrib.auth.models import User
from django.db import models


class Expense(models.Model):
    CATEGORY_CHOICES = [
        ("food", "Nourriture"),
        ("transport", "Transport"),
        ("health", "Santé"),
        ("other", "Autre"),
    ]

    user = models.ForeignKey(
        "auth.User", on_delete=models.CASCADE, related_name="expenses"
    )
    title = models.CharField(max_length=255)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.montant} Ariary"

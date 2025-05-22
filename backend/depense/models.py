from django.db import models

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('food', 'Nourriture'),
        ('transport', 'Transport'),
        ('health', 'Santé'),
        ('other', 'Autre'),
    ]

    title = models.CharField(max_length=255)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.montant} Ariary"

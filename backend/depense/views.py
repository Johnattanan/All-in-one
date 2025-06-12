from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Expense
from .serializers import ExpenseSerializer


class ExpenseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Expense.objects.all().order_by("-date")
    serializer_class = ExpenseSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "category"]
    ordering_fields = ["montant", "date"]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by("-date")

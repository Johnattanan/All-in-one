from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Note
from .serializers import NoteSerializer


class NoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Note.objects.all().order_by("-updated_at")
    serializer_class = NoteSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "content"]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user).order_by("-updated_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

from rest_framework import viewsets, permissions
from ..models import Note
from ..serializers import NoteSerializer

class NoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с заметками.
    """
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает только заметки текущего пользователя
        """
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        При создании заметки автоматически устанавливает текущего пользователя
        """
        serializer.save(user=self.request.user) 
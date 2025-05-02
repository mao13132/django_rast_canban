from rest_framework import viewsets, permissions
from ..models import Folder
from ..serializers import FolderSerializer


class FolderViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с папками.
    """
    serializer_class = FolderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает только папки текущего пользователя
        """
        return Folder.objects.filter(user_id=self.request.user)

    def perform_create(self, serializer):
        """
        При создании папки автоматически устанавливает текущего пользователя
        """
        serializer.save(user_id=self.request.user)

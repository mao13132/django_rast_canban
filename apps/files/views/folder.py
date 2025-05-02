from rest_framework import viewsets, permissions
from django.db.models import Q
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
        Возвращает папки текущего пользователя.
        Если указан parent_id в параметрах запроса, возвращает папки с этим родителем.
        Если parent_id не указан или равен null, возвращает корневые папки (без родителя).
        """
        queryset = Folder.objects.filter(user_id=self.request.user)
        parent_id = self.request.query_params.get('parent_id', None)
        
        if parent_id == 'null' or parent_id is None:
            return queryset.filter(parent_id__isnull=True)
        return queryset.filter(parent_id=parent_id)

    def perform_create(self, serializer):
        """
        При создании папки автоматически устанавливает текущего пользователя
        """
        serializer.save(user_id=self.request.user)

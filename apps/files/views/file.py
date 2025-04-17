from rest_framework import viewsets, permissions
from ..models import File
from ..serializers import FileSerializer

class FileViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с файлами.
    """
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает только файлы текущего пользователя
        """
        return File.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        При создании файла автоматически устанавливает текущего пользователя
        и вычисляет размер файла
        """
        file = serializer.validated_data['file']
        serializer.save(
            user=self.request.user,
            size=file.size
        ) 
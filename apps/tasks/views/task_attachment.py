from rest_framework import viewsets, permissions
from ..models import TaskAttachment
from ..serializers import TaskAttachmentSerializer

class TaskAttachmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с вложениями задач.
    """
    serializer_class = TaskAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает только вложения задач текущего пользователя
        """
        return TaskAttachment.objects.filter(task__user=self.request.user)

    def perform_create(self, serializer):
        """
        При создании вложения автоматически устанавливает размер файла
        """
        file = serializer.validated_data['file']
        serializer.save(size=file.size) 
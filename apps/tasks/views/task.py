from rest_framework import viewsets, permissions
from ..models import Task
from ..serializers import TaskSerializer
import logging

logger = logging.getLogger(__name__)


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с задачами.
    """
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает только задачи текущего пользователя
        """
        return Task.objects.filter(user_id=self.request.user)

    def perform_create(self, serializer):
        """
        При создании задачи автоматически устанавливает текущего пользователя
        """
        logger.info(f"Creating task with data: {serializer.validated_data}")
        serializer.save(user_id=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Переопределяем метод create для логирования входящих данных
        """
        logger.info(f"Received request data: {request.data}")
        return super().create(request, *args, **kwargs)

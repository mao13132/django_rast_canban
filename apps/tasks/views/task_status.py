from rest_framework import viewsets, permissions
from ..models import TaskStatus
from ..serializers import TaskStatusSerializer


class TaskStatusViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы со статусами задач.
    """
    serializer_class = TaskStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает только статусы текущего пользователя
        """
        status = TaskStatus.objects.order_by('order', 'name')

        return status

    def perform_create(self, serializer):
        """
        При создании статуса автоматически устанавливает текущего пользователя
        """
        serializer.save(user_id=self.request.user.id)

from rest_framework import viewsets, permissions
from ..models import Task
from ..serializers import TaskSerializer

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
        serializer.save(user_id=self.request.user) 
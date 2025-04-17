from rest_framework import viewsets, permissions
from ..models import TaskCategory
from ..serializers import TaskCategorySerializer

class TaskCategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с категориями задач.
    """
    serializer_class = TaskCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает только категории текущего пользователя
        """
        return TaskCategory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        При создании категории автоматически устанавливает текущего пользователя
        """
        serializer.save(user=self.request.user) 
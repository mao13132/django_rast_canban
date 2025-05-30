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
        categories = TaskCategory.objects.filter(user_id=self.request.user.id)

        return categories

    def perform_create(self, serializer):
        """
        При создании категории автоматически устанавливает текущего пользователя
        """
        serializer.save(user_id=self.request.user)

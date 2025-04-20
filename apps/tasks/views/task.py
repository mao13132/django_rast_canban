from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..filters import TaskFilter
from ..models import Task
from ..serializers import TaskSerializer
import logging

logger = logging.getLogger(__name__)


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с задачами.
    """
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = TaskFilter

    def get_queryset(self):
        """
        Возвращает только задачи текущего пользователя
        """
        return Task.objects.filter(
            user_id=self.request.user
        ).select_related(
            'status_id',
            'category_id'
        ).prefetch_related(
            'attachments'
        )

    def perform_create(self, serializer):
        """
        Автоматически назначает текущего пользователя как владельца задачи
        """
        logger.info(f"Creating task with data: {serializer.validated_data}")
        serializer.save(user_id=self.request.user)

    def create(self, request, *args, **kwargs):
        """
        Переопределяем метод create для логирования входящих данных
        """
        logger.info(f"Received request data: {request.data}")
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Обновление статуса задачи
        """
        task = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response(
                {'error': 'Не указан новый статус'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        task.status_id = new_status
        task.save()
        
        return Response(self.get_serializer(task).data)

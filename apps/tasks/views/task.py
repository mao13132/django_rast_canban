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
        tasks = Task.objects.filter(
            user_id=self.request.user.id
        ).select_related(
            'status_id',
            'category_id'
        ).prefetch_related(
            'attachments'
        )

        return tasks

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

    def update(self, request, *args, **kwargs):
        """
        Переопределяем метод update для логирования и возврата обновленных данных
        """
        logger.info(f"Updating task with data: {request.data}")
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        updated_instance = serializer.save()
        
        # Получаем обновленные данные
        response_data = self.get_serializer(updated_instance).data
        logger.info(f"Response data: {response_data}")
        
        return Response(response_data)

    def perform_update(self, serializer):
        """
        Сохраняет обновленные данные задачи
        """
        serializer.save()

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

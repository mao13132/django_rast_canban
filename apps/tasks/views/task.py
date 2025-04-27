from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..filters import TaskFilter
from ..models import Task
from ..serializers import TaskSerializer
from ..models import TaskStatus
from ..models import TaskCategory
from django.db.models import F, Q, Case, When, Value, IntegerField
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
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает список задач текущего пользователя, отсортированных по оставшимся дням
        """
        user = self.request.user
        queryset = Task.objects.filter(user_id=user)
        
        # Сортируем задачи по оставшимся дням (меньше дней -> выше в списке)
        return queryset.order_by(
            F('deadline_end').asc(nulls_last=True),
            'task_id'
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

    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        """
        Изменяет статус задачи
        """
        task = self.get_object()
        new_status_id = request.data.get('status_id')
        
        if not new_status_id:
            return Response(
                {'error': 'Не указан новый статус'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            new_status = TaskStatus.objects.get(
                status_id=new_status_id,
                user_id=request.user
            )
            task.status_id = new_status
            task.save()
            
            serializer = self.get_serializer(task)
            return Response(serializer.data)
        except TaskStatus.DoesNotExist:
            return Response(
                {'error': 'Статус не найден'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def change_category(self, request, pk=None):
        """
        Изменяет категорию задачи
        """
        task = self.get_object()
        new_category_id = request.data.get('category_id')
        
        if not new_category_id:
            return Response(
                {'error': 'Не указана новая категория'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            new_category = TaskCategory.objects.get(
                category_id=new_category_id,
                user_id=request.user
            )
            task.category_id = new_category
            task.save()
            
            serializer = self.get_serializer(task)
            return Response(serializer.data)
        except TaskCategory.DoesNotExist:
            return Response(
                {'error': 'Категория не найдена'},
                status=status.HTTP_404_NOT_FOUND
            )

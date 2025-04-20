from rest_framework import serializers
from ..models.task import Task
from ..models.task_status import TaskStatus
from ..models.task_category import TaskCategory
from .task_attachment import TaskAttachmentSerializer
import logging

logger = logging.getLogger(__name__)


class TaskSerializer(serializers.ModelSerializer):
    """
    Сериализатор для задач
    """
    attachments = TaskAttachmentSerializer(many=True, read_only=True)
    status = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ['task_id', 'user_id', 'title', 'description', 'status_id',
                  'category_id', 'priority', 'deadline', 'attachments', 'status', 'category']
        read_only_fields = ['task_id', 'user_id']

    def get_status(self, obj):
        """
        Возвращает данные статуса задачи
        """
        if hasattr(obj, 'status_id') and obj.status_id:
            return {
                'id': obj.status_id.status_id,
                'name': obj.status_id.name
            }
        return None

    def get_category(self, obj):
        """
        Возвращает данные категории задачи
        """
        if hasattr(obj, 'category_id') and obj.category_id:
            return {
                'id': obj.category_id.category_id,
                'name': obj.category_id.name
            }
        return None

    def validate_status_id(self, value):
        """
        Проверяем, что статус принадлежит текущему пользователю
        """
        try:
            status = TaskStatus.objects.get(status_id=value)
            if status.user_id != self.context['request'].user.id:
                raise serializers.ValidationError("Статус не принадлежит текущему пользователю")
            return value
        except TaskStatus.DoesNotExist:
            raise serializers.ValidationError("Статус не найден")

    def validate_category_id(self, value):
        """
        Проверяем, что категория принадлежит текущему пользователю
        """
        if value is None:
            return value
        try:
            category = TaskCategory.objects.get(category_id=value)
            if category.user_id != self.context['request'].user.id:
                raise serializers.ValidationError("Категория не принадлежит текущему пользователю")
            return value
        except TaskCategory.DoesNotExist:
            raise serializers.ValidationError("Категория не найдена")

    def validate(self, data):
        """
        Общая валидация данных
        """
        logger.info(f"Validating task data: {data}")
        return data

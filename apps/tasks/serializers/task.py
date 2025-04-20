from rest_framework import serializers
from ..models import Task, TaskAttachment, TaskStatus, TaskCategory
from .task_attachment import TaskAttachmentSerializer
import logging

logger = logging.getLogger(__name__)


class TaskSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Task.
    """
    attachments = TaskAttachmentSerializer(many=True, read_only=True)
    status_id = serializers.PrimaryKeyRelatedField(queryset=TaskStatus.objects.all())
    category_id = serializers.PrimaryKeyRelatedField(queryset=TaskCategory.objects.all(), required=False,
                                                     allow_null=True)

    class Meta:
        model = Task
        fields = [
            'task_id', 'title', 'description', 'status_id', 'category_id',
            'priority', 'deadline', 'attachments', 'user_id'
        ]
        read_only_fields = ['task_id', 'user_id']

    def validate_status_id(self, value):
        """
        Проверяет, что статус принадлежит текущему пользователю
        """
        logger.info(f"Validating status_id: {value}")
        if value.user_id != self.context['request'].user:
            logger.error(f"Invalid status_id: {value}, user: {self.context['request'].user}")
            raise serializers.ValidationError("Статус должен принадлежать вам")
        return value

    def validate_category_id(self, value):
        """
        Проверяет, что категория принадлежит текущему пользователю
        """
        if not value:
            return value

        logger.info(f"Validating category_id: {value}")
        if value.user_id != self.context['request'].user:
            logger.error(f"Invalid category_id: {value}, user: {self.context['request'].user}")
            raise serializers.ValidationError("Категория должна принадлежать вам")
        return value

    def validate(self, data):
        """
        Общая валидация данных
        """
        logger.info(f"Validating task data: {data}")
        return data

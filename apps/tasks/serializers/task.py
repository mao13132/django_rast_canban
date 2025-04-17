from rest_framework import serializers
from ..models import Task, TaskAttachment
from .task_attachment import TaskAttachmentSerializer

class TaskSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Task.
    """
    attachment = TaskAttachmentSerializer(read_only=True)

    class Meta:
        model = Task
        fields = [
            'task_id', 'title', 'description', 'status_id', 'category_id',
            'priority', 'deadline', 'attachment'
        ]
        read_only_fields = []

    def validate_status_id(self, value):
        """
        Проверяет, что статус принадлежит текущему пользователю
        """
        if value.user_id != self.context['request'].user:
            raise serializers.ValidationError("Статус должен принадлежать вам")
        return value

    def validate_category_id(self, value):
        """
        Проверяет, что категория принадлежит текущему пользователю
        """
        if value and value.user_id != self.context['request'].user:
            raise serializers.ValidationError("Категория должна принадлежать вам")
        return value 
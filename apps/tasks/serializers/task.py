from rest_framework import serializers
from ..models import Task, TaskAttachment
from .task_attachment import TaskAttachmentSerializer

class TaskSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Task.
    """
    attachments = TaskAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'category',
            'priority', 'deadline', 'attachments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_status(self, value):
        """
        Проверяет, что статус принадлежит текущему пользователю
        """
        if value.user != self.context['request'].user:
            raise serializers.ValidationError("Статус должен принадлежать вам")
        return value

    def validate_category(self, value):
        """
        Проверяет, что категория принадлежит текущему пользователю
        """
        if value and value.user != self.context['request'].user:
            raise serializers.ValidationError("Категория должна принадлежать вам")
        return value 
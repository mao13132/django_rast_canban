from rest_framework import serializers
from ..models import TaskStatus

class TaskStatusSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели TaskStatus.
    """
    class Meta:
        model = TaskStatus
        fields = ['id', 'name', 'order', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at'] 
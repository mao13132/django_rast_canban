from rest_framework import serializers
from ..models import TaskStatus

class TaskStatusSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели TaskStatus.
    """
    class Meta:
        model = TaskStatus
        fields = ['status_id', 'name', 'user_id']
        read_only_fields = ['status_id', 'user_id'] 
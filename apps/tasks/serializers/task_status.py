from rest_framework import serializers
from ..models import TaskStatus

class TaskStatusSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели TaskStatus.
    """
    class Meta:
        model = TaskStatus
        fields = ['status_id', 'name']
        read_only_fields = [] 
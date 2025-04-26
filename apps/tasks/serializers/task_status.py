from rest_framework import serializers
from ..models import TaskStatus

class TaskStatusSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели TaskStatus.
    """
    user_id = serializers.IntegerField(source='user_id.id', read_only=True)

    class Meta:
        model = TaskStatus
        fields = ['status_id', 'name', 'user_id', 'order', 'color']
        read_only_fields = ['status_id', 'user_id'] 
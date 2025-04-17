from rest_framework import serializers
from ..models import TaskCategory

class TaskCategorySerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели TaskCategory.
    """
    class Meta:
        model = TaskCategory
        fields = ['id', 'name', 'color', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at'] 
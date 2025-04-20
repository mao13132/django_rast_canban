from rest_framework import serializers
from ..models import TaskCategory

class TaskCategorySerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели TaskCategory.
    """
    class Meta:
        model = TaskCategory
        fields = ['category_id', 'name', 'user_id']
        read_only_fields = ['category_id', 'user_id'] 
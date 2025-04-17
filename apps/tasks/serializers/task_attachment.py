from rest_framework import serializers
from ..models import TaskAttachment

class TaskAttachmentSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели TaskAttachment.
    """
    class Meta:
        model = TaskAttachment
        fields = ['id', 'task', 'file', 'created_at']
        read_only_fields = ['created_at'] 
from rest_framework import serializers
from ..models import TaskAttachment

class TaskAttachmentSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели TaskAttachment.
    """
    class Meta:
        model = TaskAttachment
        fields = ['id', 'name', 'file', 'size', 'created_at']
        read_only_fields = ['size', 'created_at'] 
from rest_framework import serializers
from ..models import TaskAttachment

class TaskAttachmentSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели TaskAttachment.
    """
    class Meta:
        model = TaskAttachment
        fields = ['attachment_id', 'task_id', 'name', 'path', 'size']
        read_only_fields = ['size'] 
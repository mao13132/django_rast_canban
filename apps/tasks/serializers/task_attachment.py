from rest_framework import serializers
from ..models.task_attachment import TaskAttachment


class TaskAttachmentSerializer(serializers.ModelSerializer):
    """
    Сериализатор для вложений к задачам
    """
    class Meta:
        model = TaskAttachment
        fields = ['attachment_id', 'name', 'path', 'size']
        read_only_fields = ['attachment_id', 'size']

    def validate(self, attrs):
        """
        Валидация размера файла
        """
        if attrs.get('path'):
            file_size = attrs['path'].size
            if file_size > 10 * 1024 * 1024:  # 10MB
                raise serializers.ValidationError("Размер файла не должен превышать 10MB")
            attrs['size'] = file_size
        return attrs 
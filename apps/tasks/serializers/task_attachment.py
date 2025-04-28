from rest_framework import serializers
from ..models.task_attachment import TaskAttachment


class TaskAttachmentSerializer(serializers.ModelSerializer):
    """
    Сериализатор для вложений задачи
    """
    file = serializers.FileField(source='path', write_only=True)
    url = serializers.SerializerMethodField()

    class Meta:
        model = TaskAttachment
        fields = ['attachment_id', 'name', 'size', 'uploaded_at', 'file', 'url']
        read_only_fields = ['attachment_id', 'size', 'uploaded_at']

    def get_url(self, obj):
        """
        Возвращает URL для скачивания файла
        """
        if obj.path:
            return obj.path.url
        return None

    def create(self, validated_data):
        """
        Создает новое вложение и возвращает его
        """
        file = validated_data.pop('path')
        validated_data['size'] = file.size
        validated_data['name'] = file.name
        validated_data['user_id'] = self.context['request'].user
        
        instance = TaskAttachment.objects.create(**validated_data, path=file)
        return instance

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
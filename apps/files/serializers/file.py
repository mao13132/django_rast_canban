from rest_framework import serializers
from ..models import File

class FileSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели File.
    """
    class Meta:
        model = File
        fields = [
            'id', 'name', 'folder', 'file', 'size',
            'is_favorite', 'is_trashed', 'created_at', 'updated_at'
        ]
        read_only_fields = ['size', 'created_at', 'updated_at']

    def validate_folder(self, value):
        """
        Проверяет, что папка принадлежит тому же пользователю
        """
        if value and value.user != self.context['request'].user:
            raise serializers.ValidationError("Папка должна принадлежать вам")
        return value 
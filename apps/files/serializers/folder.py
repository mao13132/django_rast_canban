from rest_framework import serializers
from ..models import Folder


class FolderSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Folder.
    """
    class Meta:
        model = Folder
        fields = [
            'folder_id', 'name', 'parent_id', 'is_favorite',
            'is_trashed', 'user_id'
        ]
        read_only_fields = ['folder_id', 'user_id']

    def validate_parent_id(self, value):
        """
        Проверяет, что родительская папка принадлежит тому же пользователю
        """
        if value is None:
            return value  # Разрешаем null для корневых папок
        if value.user_id != self.context['request'].user:
            raise serializers.ValidationError("Родительская папка должна принадлежать вам")
        return value

    def create(self, validated_data):
        """
        Создает новую папку, автоматически устанавливая текущего пользователя
        """
        validated_data['user_id'] = self.context['request'].user
        return super().create(validated_data)

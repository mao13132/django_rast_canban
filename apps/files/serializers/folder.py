from rest_framework import serializers
from ..models import Folder

class FolderSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Folder.
    Обрабатывает создание и получение папок с учетом иерархии.
    """
    class Meta:
        model = Folder
        fields = [
            'folder_id', 'name', 'parent_id', 'is_favorite',
            'is_trashed', 'size'
        ]
        read_only_fields = ['folder_id', 'size']

    def validate_parent_id(self, value):
        """
        Проверяет, что:
        1. Родительская папка принадлежит тому же пользователю
        2. Папка не может быть родителем сама себе
        """
        request = self.context.get('request')
        if not request or not request.user:
            raise serializers.ValidationError("Не удалось определить пользователя")

        # Разрешаем null для корневых папок
        if value is None:
            return value

        # Проверяем принадлежность родительской папки пользователю
        if value.user_id != request.user:
            raise serializers.ValidationError("Родительская папка должна принадлежать вам")

        # Проверяем, не является ли папка родителем сама себе
        if self.instance and value.folder_id == self.instance.folder_id:
            raise serializers.ValidationError("Папка не может быть родителем сама себе")

        return value

    def create(self, validated_data):
        """
        Создает новую папку, автоматически устанавливая текущего пользователя
        """
        validated_data['user_id'] = self.context['request'].user
        return super().create(validated_data)

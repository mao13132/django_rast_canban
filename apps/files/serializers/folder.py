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
            'is_trashed', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate_parent_id(self, value):
        """
        Проверяет, что родительская папка принадлежит тому же пользователю
        """
        if value and value.user_id != self.context['request'].user:
            raise serializers.ValidationError("Родительская папка должна принадлежать вам")
        return value

from rest_framework import serializers
from ..models import Link


class LinkSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Link.
    """

    class Meta:
        model = Link
        fields = [
            'link_id', 'url', 'is_favorite', 'is_trashed', 'user_id'
        ]
        read_only_fields = []

    def validate_user_id(self, value):
        """
        Проверяет, что текущий пользователь является владельцем ссылки
        """
        if value != self.context['request'].user:
            raise serializers.ValidationError("Вы должны быть владельцем ссылки")
        return value

from rest_framework import serializers
from ..models import Link
from apps.users.models import User


class LinkSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Link.
    """
    user_id = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        help_text='ID пользователей'
    )

    class Meta:
        model = Link
        fields = [
            'link_id', 'url', 'is_favorite', 'is_trashed', 'user_id'
        ]
        read_only_fields = []

    def validate_user_id(self, value):
        """
        Проверяет, что текущий пользователь входит в список владельцев
        """
        if self.context['request'].user not in value:
            raise serializers.ValidationError("Вы должны быть владельцем ссылки")
        return value

from rest_framework import serializers
from ..models import Note


class NoteSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Note.
    """

    class Meta:
        model = Note
        fields = [
            'note_id', 'title', 'content', 'is_pinned',
            'is_archived', 'user_id'
        ]
        read_only_fields = ['user_id']

    def create(self, validated_data):
        """
        Переопределяем метод create для корректной работы с user_id
        """
        user = self.context['request'].user
        validated_data['user_id'] = user
        return super().create(validated_data)

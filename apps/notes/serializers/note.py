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
            'is_archived'
        ]
        read_only_fields = []

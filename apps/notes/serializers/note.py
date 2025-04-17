from rest_framework import serializers
from ..models import Note

class NoteSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Note.
    """
    class Meta:
        model = Note
        fields = [
            'id', 'title', 'content', 'is_pinned',
            'is_archived', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at'] 
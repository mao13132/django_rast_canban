from rest_framework import serializers
from ..models import Link

class LinkSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Link.
    """
    class Meta:
        model = Link
        fields = [
            'id', 'url', 'title', 'description',
            'is_favorite', 'is_trashed', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at'] 
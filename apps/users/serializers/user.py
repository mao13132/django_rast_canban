from rest_framework import serializers
from ..models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели User.
    """

    class Meta:
        model = User
        fields = ['user_id', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['user_id', 'date_joined']

from rest_framework import serializers
from ..models import User

class UserSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели User.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined'] 
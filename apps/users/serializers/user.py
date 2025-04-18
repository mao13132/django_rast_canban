from rest_framework import serializers
from ..models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели User.
    Содержит только необходимые поля для регистрации и аутентификации.
    """

    class Meta:
        model = User
        fields = ['id', 'email', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Сериализатор для создания пользователя.
    Требует только email и пароль.
    """
    password = serializers.CharField(write_only=True)
    re_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 're_password']

    def validate(self, attrs):
        if attrs['password'] != attrs['re_password']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('re_password')
        user = User.objects.create_user(**validated_data)
        return user

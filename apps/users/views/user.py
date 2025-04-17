from rest_framework import viewsets, permissions
from ..models import User
from ..serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с пользователями.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает только текущего пользователя
        """
        return User.objects.filter(id=self.request.user.id)

    def get_object(self):
        """
        Возвращает текущего пользователя
        """
        return self.request.user

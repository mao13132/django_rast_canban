from rest_framework import viewsets, permissions
from ..models import Link
from ..serializers import LinkSerializer

class LinkViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы со ссылками.
    """
    serializer_class = LinkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает только ссылки текущего пользователя
        """
        return Link.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        При создании ссылки автоматически устанавливает текущего пользователя
        """
        serializer.save(user=self.request.user) 
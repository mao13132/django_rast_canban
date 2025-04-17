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
        Возвращает ссылки, где текущий пользователь является владельцем
        """
        return Link.objects.filter(user_id=self.request.user)

    def perform_create(self, serializer):
        """
        При создании ссылки автоматически добавляет текущего пользователя в список владельцев
        """
        link = serializer.save()
        link.user_id.add(self.request.user) 
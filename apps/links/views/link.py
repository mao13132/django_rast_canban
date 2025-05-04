from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
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
        Возвращает ссылки текущего пользователя
        """
        return Link.objects.filter(user_id=self.request.user)

    def perform_create(self, serializer):
        """
        При создании ссылки автоматически устанавливает текущего пользователя как владельца
        """
        serializer.save(user_id=self.request.user)

    @action(detail=True, methods=['post'])
    def toggle_favorite(self, request, pk=None):
        """
        Переключает статус избранного для ссылки
        """
        link = self.get_object()
        link.is_favorite = not link.is_favorite
        link.save()
        serializer = self.get_serializer(link)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_trashed(self, request, pk=None):
        """
        Переключает статус корзины для ссылки
        """
        link = self.get_object()
        link.is_trashed = not link.is_trashed
        link.save()
        serializer = self.get_serializer(link)
        return Response(serializer.data)

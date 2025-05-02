from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from ..models import File, Folder
from ..serializers import FileSerializer


class FileViewSet(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает файлы текущего пользователя.
        Если указан folder_id в параметрах запроса, возвращает файлы в этой папке.
        Если folder_id не указан или равен null, возвращает файлы без папки (в корне).
        """
        queryset = File.objects.filter(user_id=self.request.user)
        folder_id = self.request.query_params.get('folder_id', None)
        
        if folder_id == 'null' or folder_id is None:
            return queryset.filter(folder_id__isnull=True)
        return queryset.filter(folder_id=folder_id)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
    
        # Сохраняем запись в БД (файл сохранится автоматически через FileField)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
    
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        folder_id = serializer.validated_data.get('folder_id')
        folder = None

        if folder_id is not None:
            folder = get_object_or_404(
                Folder,
                folder_id=folder_id,
                user_id=self.request.user
            )

        serializer.save(
            user_id=self.request.user,
            folder_id=folder,
            size=serializer.validated_data['file'].size
        )

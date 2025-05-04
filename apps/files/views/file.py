from django.http import FileResponse
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
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

    def get_file_by_id(self, file_id):
        """
        Получает файл только по ID, без учета folder_id
        """
        file = get_object_or_404(
            File.objects.filter(user_id=self.request.user),
            file_id=file_id
        )

        return file

    @action(detail=True, methods=['post', 'options'])
    def toggle_favorite(self, request, pk=None):
        """
        Переключает статус избранного для файла
        """
        file = self.get_file_by_id(pk)
        file.is_favorite = not file.is_favorite
        file.save()
        serializer = self.get_serializer(file)
        return Response(serializer.data)

    @action(detail=True, methods=['post', 'options'])
    def toggle_trashed(self, request, pk=None):
        """
        Переключает статус корзины для файла
        """
        file = self.get_file_by_id(pk)
        file.is_trashed = not file.is_trashed
        file.save()
        serializer = self.get_serializer(file)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """
        Обновляет файл с подробным логированием для отладки.
        Использует get_file_by_id для получения объекта файла.
        """
        try:
            # Получаем объект файла через get_file_by_id
            instance = self.get_file_by_id(kwargs.get('pk'))

            # Создаем и валидируем сериализатор
            serializer = self.get_serializer(instance, data=request.data, partial=True)

            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Сохраняем изменения
            self.perform_update(serializer)

            return Response(serializer.data)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_update(self, serializer):
        """
        Выполняет обновление файла с учетом folder_id
        """
        folder_id = serializer.validated_data.get('folder_id')
        folder = None

        if folder_id is not None:
            folder = get_object_or_404(
                Folder,
                folder_id=folder_id,
                user_id=self.request.user
            )

        serializer.save(folder_id=folder)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        Скачивание файла
        """
        file = self.get_file_by_id(pk)
        
        try:
            response = FileResponse(file.file, as_attachment=True)
            response['Content-Disposition'] = f'attachment; filename="{file.name}"'
            return response
        except Exception as e:
            return Response(
                {'error': 'Ошибка при скачивании файла'},
                status=status.HTTP_400_BAD_REQUEST
            )

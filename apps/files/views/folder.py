from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404
from ..models import Folder, File
from ..serializers import FolderSerializer, FileSerializer


class FolderViewSet(viewsets.ModelViewSet):
    """
    ViewSet для работы с папками.
    """
    serializer_class = FolderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Возвращает папки текущего пользователя.
        Если указан parent_id в параметрах запроса, возвращает папки с этим родителем.
        Если parent_id не указан или равен null, возвращает корневые папки (без родителя).
        """
        queryset = Folder.objects.filter(user_id=self.request.user)
        parent_id = self.request.query_params.get('parent_id', None)

        if parent_id == 'null' or parent_id is None:
            return queryset.filter(parent_id__isnull=True)
        return queryset.filter(parent_id=parent_id)

    def perform_create(self, serializer):
        """
        При создании папки автоматически устанавливает текущего пользователя
        """
        serializer.save(user_id=self.request.user)

    @action(detail=False, methods=['post'], url_path='upload')
    @transaction.atomic
    def upload_folder_with_files(self, request):
        """
        Метод для загрузки папки с файлами.
        Принимает данные в формате multipart/form-data:
        - name: имя папки
        - parent_id: ID родительской папки (опционально)
        - files[n][name]: имя файла
        - files[n][path]: путь к файлу
        - files[n][size]: размер файла
        - files[n][type]: тип файла
        - files[n][blob]: файл
        """
        try:
            # Создаем основную папку
            folder_data = {
                'name': request.data.get('name'),
                'parent_id': request.data.get('parent_id'),
                'is_favorite': request.data.get('is_favorite', 'false') == 'true',
                'is_trashed': request.data.get('is_trashed', 'false') == 'true'
            }

            folder_serializer = self.get_serializer(data=folder_data)
            folder_serializer.is_valid(raise_exception=True)
            folder = folder_serializer.save(user_id=request.user)

            # Собираем файлы из QueryDict
            files_count = len([k for k in request.data.keys() if k.startswith('files[') and k.endswith('[name]')])
            processed_files = []

            for i in range(files_count):
                file_data = {
                    'name': request.data.get(f'files[{i}][name]'),
                    'path': request.data.get(f'files[{i}][path]'),
                    'size': int(request.data.get(f'files[{i}][size]', 0)),
                    'type': request.data.get(f'files[{i}][type]', ''),
                    'blob': request.data.get(f'files[{i}][blob]')
                }

                # Создаем промежуточные папки из пути
                path_parts = file_data['path'].split('/')
                current_parent = folder

                # Создаем структуру папок (если путь не пустой)
                if len(path_parts) > 1:
                    for folder_name in path_parts[:-1]:
                        subfolder, created = Folder.objects.get_or_create(
                            name=folder_name,
                            parent_id=current_parent,
                            user_id=request.user,
                            defaults={'size': 0}
                        )
                        current_parent = subfolder

                # Создаем файл
                # Создаем файл
                file_serializer = FileSerializer(data={
                    'name': path_parts[-1],
                    'file': file_data['blob'],
                    'size': file_data['size'],
                    'folder_id': current_parent.folder_id  # Добавляем folder_id при создании
                })

                is_valid = file_serializer.is_valid()

                # Добавляем отладочную информацию
                if not is_valid:
                    return Response({
                        'error': 'Ошибка валидации файла',
                        'details': file_serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)

                if is_valid:
                    file = file_serializer.save(
                        user_id=request.user,
                        folder_id=current_parent,  # Передаем сам объект папки, а не его ID
                        size=file_data['size']
                    )
                    processed_files.append(file_serializer.data)

                    # Обновляем размер всех родительских папок
                    parent_folder = current_parent
                    while parent_folder:
                        parent_folder.size += file_data['size']
                        parent_folder.save()
                        parent_folder = parent_folder.parent_id

            return Response({
                'folder': folder_serializer.data,
                'files': processed_files
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

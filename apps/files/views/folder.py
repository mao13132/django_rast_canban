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

    @action(detail=True, methods=['post'])
    def toggle_favorite(self, request, pk=None):
        """
        Переключает статус избранного для папки
        """
        folder = self.get_object()
        folder.is_favorite = not folder.is_favorite
        folder.save()
        serializer = self.get_serializer(folder)
        return Response(serializer.data)

    def get_folder_by_id(self, folder_id):
        """
        Получает папку только по ID, без учета parent_id
        """
        return get_object_or_404(
            Folder.objects.filter(user_id=self.request.user),
            folder_id=folder_id
        )

    @action(detail=True, methods=['post'])
    def toggle_trashed(self, request, pk=None):
        """
        Переключает статус корзины для папки
        """
        folder = self.get_folder_by_id(pk)
        folder.is_trashed = not folder.is_trashed
        folder.save()
        serializer = self.get_serializer(folder)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_favorite(self, request, pk=None):
        """
        Переключает статус избранного для папки
        """
        folder = self.get_folder_by_id(pk)
        folder.is_favorite = not folder.is_favorite
        folder.save()
        serializer = self.get_serializer(folder)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """
        Обновляет папку с подробным логированием для отладки.
        Использует get_folder_by_id для получения объекта папки.
        """
        try:
            # Получаем объект папки через get_folder_by_id
            instance = self.get_folder_by_id(kwargs.get('pk'))

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
        Выполняет обновление папки с учетом parent_id
        """
        parent_id = serializer.validated_data.get('parent_id')
        parent = None

        if parent_id is not None:
            parent = get_object_or_404(
                Folder,
                folder_id=parent_id,
                user_id=self.request.user
            )

        serializer.save(parent_id=parent)

    def get_all_children(self, folder):
        """
        Рекурсивно получает все дочерние папки и файлы
        """
        result = {
            'folders': [],
            'files': []
        }
        
        # Получаем все дочерние папки
        children = Folder.objects.filter(parent_id=folder)
        for child in children:
            result['folders'].append(child)
            child_content = self.get_all_children(child)
            result['folders'].extend(child_content['folders'])
            result['files'].extend(child_content['files'])
        
        # Получаем все файлы в текущей папке
        files = File.objects.filter(folder_id=folder)
        result['files'].extend(files)
        
        return result

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """
        Скачивает папку со всем содержимым в виде zip-архива с сохранением иерархии
        """
        import zipfile
        import os
        from django.http import HttpResponse
        from django.conf import settings
        import tempfile
        
        folder = self.get_folder_by_id(pk)
        if not folder:
            return Response(
                {'error': 'Папка не найдена'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Получаем все содержимое папки
        content = self.get_all_children(folder)
        content['folders'].insert(0, folder)  # Добавляем корневую папку

        # Создаем временный файл для архива
        with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
            # Создаем zip архив
            with zipfile.ZipFile(tmp_file, 'w', zipfile.ZIP_DEFLATED) as archive:
                # Добавляем папки (создаем структуру)
                for folder_obj in content['folders']:
                    # Создаем путь относительно корневой папки
                    folder_path = []
                    current = folder_obj
                    
                    # Собираем путь от текущей папки до корневой
                    while current and current != folder:
                        folder_path.insert(0, current.name)
                        current = current.parent_id
                    
                    # Если это не корневая папка, добавляем её в архив
                    if folder_obj != folder:
                        archive_path = os.path.join(folder.name, *folder_path)
                        archive.writestr(f"{archive_path}/", "")

                # Добавляем файлы
                for file_obj in content['files']:
                    # Создаем путь к файлу
                    file_path = []
                    current = file_obj.folder_id
                    
                    # Собираем путь от папки файла до корневой
                    while current and current != folder:
                        file_path.insert(0, current.name)
                        current = current.parent_id
                    
                    # Создаем полный путь в архиве
                    archive_path = os.path.join(folder.name, *file_path, file_obj.name)
                    
                    # Получаем физический путь к файлу
                    file_full_path = os.path.join(settings.MEDIA_ROOT, str(file_obj.file))
                    if os.path.exists(file_full_path):
                        archive.write(file_full_path, archive_path)

        # Читаем архив для отправки
        with open(tmp_file.name, 'rb') as f:
            response = HttpResponse(
                f.read(),
                content_type='application/zip'
            )
            response['Content-Disposition'] = f'attachment; filename="{folder.name}.zip"'

        # Удаляем временный файл
        os.unlink(tmp_file.name)

        return response

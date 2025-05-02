from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from ..models import File, Folder
from ..serializers import FileSerializer


class FileViewSet(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return File.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Сохраняем файл в MEDIA_ROOT
        file_obj = serializer.validated_data['file']
        file_name = serializer.validated_data.get('name', file_obj.name)
        file_path = f'{file_name}'
        
        with open(f'media/{file_path}', 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)

        # Сохраняем запись в БД
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

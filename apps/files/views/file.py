from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from ..models import File
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
        file_path = f'{file_obj.name}'
        with open(f'media/{file_path}', 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)

        # Сохраняем запись в БД
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(
            user_id=self.request.user,
            size=serializer.validated_data['file'].size
        )

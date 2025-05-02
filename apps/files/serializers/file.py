import os

from rest_framework import serializers
from ..models import File


class FolderIdField(serializers.IntegerField):
    def to_internal_value(self, data):
        if data in ('null', 'None', None, ''):
            return None
        try:
            return int(data)
        except (ValueError, TypeError):
            return None
            
    def to_representation(self, value):
        if value is None:
            return None
        return value.folder_id if hasattr(value, 'folder_id') else value


class FileSerializer(serializers.ModelSerializer):
    folder_id = FolderIdField(required=False, allow_null=True)
    is_favorite = serializers.BooleanField(required=False, default=False)
    is_trashed = serializers.BooleanField(required=False, default=False)

    class Meta:
        model = File
        fields = ['file_id', 'name', 'folder_id', 'file', 'size', 'is_favorite', 'is_trashed']
        extra_kwargs = {
            'file': {'required': True},
            'name': {'required': False, 'allow_blank': True}
        }

    def to_internal_value(self, data):
        ret = super().to_internal_value(data)
        return self.validate(ret)

    def validate(self, data):
        # Проверяем уникальность имени файла в папке
        if 'name' in data and 'folder_id' in data:
            name = data['name']
            folder_id = data['folder_id']
            counter = 1
            
            # Ищем файлы с таким же именем в папке
            while File.objects.filter(
                name=name,
            ).exists():
                # Если файл существует - добавляем (1), (2) и т.д.
                base, ext = os.path.splitext(name)
                name = f"{base} ({counter}){ext}"
                counter += 1
            
            data['name'] = name

        for field in ['is_favorite', 'is_trashed']:
            if field in data:
                if isinstance(data[field], str):
                    data[field] = data[field].lower() in ('true', '1', 't', 'y', 'yes')
                elif isinstance(data[field], int):
                    data[field] = bool(data[field])
        return data

    def validate_file(self, value):
        if not value and not self.instance:
            raise serializers.ValidationError("Файл обязателен")
        return value

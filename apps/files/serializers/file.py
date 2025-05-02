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
        # Сначала получаем базовые преобразованные данные
        ret = super().to_internal_value(data)

        # Явно вызываем validate для дополнительной обработки
        return self.validate(ret)

    # Удаляем дублирующую валидацию из метода validate
    def validate(self, data):
        print("Метод validate вызван!")
        
        # Обрабатываем булевы значения
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

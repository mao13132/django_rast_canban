from rest_framework import serializers
from ..models.task import Task
from ..models.task_status import TaskStatus
from ..models.task_category import TaskCategory
from .task_attachment import TaskAttachmentSerializer
import logging

logger = logging.getLogger(__name__)


class TaskSerializer(serializers.ModelSerializer):
    """
    Сериализатор для задач
    """
    attachments = TaskAttachmentSerializer(many=True, read_only=True)
    status = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ['task_id', 'user_id', 'title', 'description', 'status_id',
                  'category_id', 'priority', 'deadline', 'attachments', 'status', 'category']
        read_only_fields = ['task_id', 'user_id']

    def get_status(self, obj):
        """
        Возвращает данные статуса задачи
        """
        if hasattr(obj, 'status_id') and obj.status_id:
            return {
                'id': obj.status_id.status_id,
                'name': obj.status_id.name
            }
        return None

    def get_category(self, obj):
        """
        Возвращает данные категории задачи
        """
        if hasattr(obj, 'category_id') and obj.category_id:
            return {
                'id': obj.category_id.category_id,
                'name': obj.category_id.name
            }
        return None

    def validate_status_id(self, value):
        """
        Проверяем, что статус принадлежит текущему пользователю
        """
        if not value:
            raise serializers.ValidationError("Статус обязателен")

        try:
            # Если пришел объект, извлекаем ID
            if hasattr(value, 'status_id'):
                status_id = value.status_id
            else:
                status_id = value

            status = TaskStatus.objects.get(status_id=status_id)
            if status.user_id.id != self.context['request'].user.id:
                raise serializers.ValidationError("Статус не принадлежит текущему пользователю")
            return status  # Возвращаем объект TaskStatus вместо ID
        except TaskStatus.DoesNotExist:
            raise serializers.ValidationError("Статус не найден")

    def validate_category_id(self, value):
        """
        Проверяем, что категория принадлежит текущему пользователю
        """
        if not value:
            return None  # Категория не обязательна

        try:
            # Если пришел объект, извлекаем ID
            if hasattr(value, 'category_id'):
                category_id = value.category_id
            else:
                category_id = value

            category = TaskCategory.objects.get(category_id=category_id)
            if category.user_id.id != self.context['request'].user.id:
                raise serializers.ValidationError("Категория не принадлежит текущему пользователю")
            return category  # Возвращаем объект TaskCategory вместо ID
        except TaskCategory.DoesNotExist:
            raise serializers.ValidationError("Категория не найдена")

    def validate(self, data):
        """
        Общая валидация данных
        """
        logger.info(f"Validating task data: {data}")
        
        # Проверяем обязательные поля
        if not data.get('title'):
            raise serializers.ValidationError({"title": "Название задачи обязательно"})
            
        if not data.get('status_id'):
            raise serializers.ValidationError({"status_id": "Статус задачи обязателен"})
            
        if not data.get('priority'):
            raise serializers.ValidationError({"priority": "Приоритет задачи обязателен"})
            
        return data

    def create(self, validated_data):
        """
        Создает новую задачу и возвращает её в нужном формате
        """
        logger.info(f"Creating task with data: {validated_data}")
        
        # Создаем задачу
        task = Task.objects.create(
            user_id=self.context['request'].user,
            title=validated_data['title'],
            description=validated_data.get('description', ''),
            status_id=validated_data['status_id'],
            category_id=validated_data.get('category_id'),
            priority=validated_data.get('priority', 'medium'),
            deadline=validated_data.get('deadline')
        )
        
        logger.info(f"Created task: {task}")
        return task

    def to_representation(self, instance):
        """
        Преобразует объект в словарь для сериализации.
        Обеспечивает единообразный формат данных при создании/обновлении и получении задач.
        """
        data = super().to_representation(instance)
        
        # Добавляем ID в корень объекта
        data['id'] = instance.task_id
        
        # Форматируем статус
        if instance.status_id:
            data['status'] = {
                'id': instance.status_id.status_id,
                'name': instance.status_id.name
            }
        
        # Форматируем категорию
        if instance.category_id:
            data['category'] = {
                'id': instance.category_id.category_id,
                'name': instance.category_id.name
            }
        
        # Форматируем вложения
        if hasattr(instance, 'attachments'):
            data['attachments'] = TaskAttachmentSerializer(instance.attachments.all(), many=True).data
        
        return data

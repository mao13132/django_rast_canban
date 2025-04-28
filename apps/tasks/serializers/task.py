from rest_framework import serializers

from ..models import TaskAttachment
from ..models.task import Task
from ..models.task_status import TaskStatus
from ..models.task_category import TaskCategory
from apps.notes.models.note import Note
from .task_attachment import TaskAttachmentSerializer
import logging
import json

logger = logging.getLogger(__name__)


class TaskSerializer(serializers.ModelSerializer):
    """
    Сериализатор для задач
    """
    attachments = TaskAttachmentSerializer(many=True, read_only=True)
    status = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    note = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Task
        fields = ['task_id', 'user_id', 'title', 'description', 'status_id',
                  'category_id', 'note_id', 'priority', 'deadline_start', 'deadline_end',
                  'attachments', 'status', 'category', 'note', 'days_remaining',
                  'created_at', 'updated_at']
        read_only_fields = ['task_id', 'user_id', 'days_remaining', 'created_at', 'updated_at']

    def get_status(self, obj):
        """
        Возвращает данные статуса задачи
        """
        if hasattr(obj, 'status_id') and obj.status_id:
            return {
                'id': obj.status_id.status_id,
                'name': obj.status_id.name,
                'order': obj.status_id.order,
                'color': obj.status_id.color,
                'user_id': obj.status_id.user_id.id
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

    def get_note(self, obj):
        """
        Возвращает данные заметки задачи
        """
        if hasattr(obj, 'note_id') and obj.note_id:
            return {
                'id': obj.note_id.note_id,
                'title': obj.note_id.title,
                'content': obj.note_id.content,
                'is_pinned': obj.note_id.is_pinned,
                'is_archived': obj.note_id.is_archived
            }
        return None

    def get_days_remaining(self, obj):
        """
        Возвращает количество оставшихся дней до дедлайна
        """
        days = obj.get_days_remaining()
        # Возвращаем 0 вместо None, если дедлайн прошел
        return 0 if days == 0 else days

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

    def validate_note_id(self, value):
        """
        Проверяем, что заметка принадлежит текущему пользователю
        """
        if not value:
            return None  # Заметка не обязательна

        try:
            # Если пришел объект, извлекаем ID
            if hasattr(value, 'note_id'):
                note_id = value.note_id
            else:
                note_id = value

            note = Note.objects.get(note_id=note_id)
            if note.user_id.id != self.context['request'].user.id:
                raise serializers.ValidationError("Заметка не принадлежит текущему пользователю")
            return note  # Возвращаем объект Note вместо ID
        except Note.DoesNotExist:
            raise serializers.ValidationError("Заметка не найдена")

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

        # Проверяем корректность дат
        deadline_start = data.get('deadline_start')
        deadline_end = data.get('deadline_end')

        if deadline_start and deadline_end and deadline_start > deadline_end:
            raise serializers.ValidationError({"deadline": "Дата начала не может быть позже даты окончания"})

        return data

    def create(self, validated_data):
        """
        Создает новую задачу и возвращает её в нужном формате
        """
        logger.info(f"Creating task with data: {validated_data}")

        # Получаем файлы из request
        files = self.context['request'].FILES.getlist('attachments')
        logger.info(f"Received files: {files}")

        # Создаем задачу
        task = Task.objects.create(
            user_id=self.context['request'].user,
            title=validated_data['title'],
            description=validated_data.get('description', ''),
            status_id=validated_data['status_id'],
            category_id=validated_data.get('category_id'),
            note_id=validated_data.get('note_id'),
            priority=validated_data.get('priority', 'medium'),
            deadline_start=validated_data.get('deadline_start'),
            deadline_end=validated_data.get('deadline_end')
        )

        # Создаем вложения
        for file in files:
            TaskAttachment.objects.create(
                task_id=task,
                user_id=self.context['request'].user,
                name=file.name,
                path=file,
                size=file.size
            )

        logger.info(f"Created task: {task}")
        return task

    def update(self, instance, validated_data):
        """
        Обновляет существующую задачу
        """
        logger.info(f"Updating task {instance.task_id} with data: {validated_data}")

        # Получаем файлы из request
        files = self.context['request'].FILES.getlist('attachments')
        existing_attachments = self.context['request'].data.getlist('existing_attachments')
        logger.info(f"Received files: {files}")
        logger.info(f"Existing attachments: {existing_attachments}")

        # Обновляем основные поля
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.status_id = validated_data.get('status_id', instance.status_id)
        instance.category_id = validated_data.get('category_id', instance.category_id)
        instance.note_id = validated_data.get('note_id', instance.note_id)
        instance.priority = validated_data.get('priority', instance.priority)
        instance.deadline_start = validated_data.get('deadline_start', instance.deadline_start)
        instance.deadline_end = validated_data.get('deadline_end', instance.deadline_end)

        instance.save()

        # Удаляем старые вложения, которых нет в списке existing_attachments
        current_attachments = instance.attachments.all()
        for attachment in current_attachments:
            if str(attachment.attachment_id) not in existing_attachments:
                attachment.delete()

        # Добавляем новые файлы
        for file in files:
            TaskAttachment.objects.create(
                task_id=instance,
                user_id=self.context['request'].user,
                name=file.name,
                path=file,
                size=file.size
            )

        logger.info(f"Updated task: {instance}")
        return instance

    def to_representation(self, instance):
        """
        Преобразует объект задачи в словарь
        """
        try:
            data = super().to_representation(instance)
            # Добавляем ID в корень объекта
            data['id'] = instance.task_id

            # Форматируем deadline в нужный формат
            if data.get('deadline_start') or data.get('deadline_end'):
                data['deadline'] = {
                    'start': data.pop('deadline_start'),
                    'end': data.pop('deadline_end')
                }
            else:
                data['deadline'] = None

            # Логируем полные данные для отладки
            logger.info("Full task representation: %s", json.dumps(data, ensure_ascii=False))
            return data
        except Exception as e:
            logger.error("Error in to_representation: %s", str(e))
            raise

from django.db import models
from django.core.validators import FileExtensionValidator
from apps.users.models import User
from .task import Task


class TaskAttachment(models.Model):
    """
    Модель для вложений задачи
    """
    attachment_id = models.AutoField(primary_key=True, verbose_name='ID вложения')
    name = models.CharField(
        max_length=255,
        help_text='Название файла'
    )
    path = models.FileField(
        upload_to='task_attachments/',
        validators=[FileExtensionValidator(
            allowed_extensions=['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png']
        )],
        help_text='Путь к файлу'
    )
    size = models.IntegerField(
        help_text='Размер файла в байтах'
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        help_text='Дата загрузки'
    )
    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='attachments',
        help_text='Владелец файла'
    )
    task_id = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='attachments',
        help_text='Задача'
    )

    class Meta:
        verbose_name = 'Вложение'
        verbose_name_plural = 'Вложения'
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.name

from django.db import models
from .task import Task


class TaskAttachment(models.Model):
    """
    Модель для хранения вложений к задачам
    """
    attachment_id = models.AutoField(primary_key=True, verbose_name='ID вложения')

    task_id = models.OneToOneField(
        Task,
        on_delete=models.CASCADE,
        related_name='attachment',
        verbose_name='Задача'
    )
    name = models.CharField(
        max_length=100,
        help_text='Название вложения'
    )
    path = models.FileField(
        upload_to='task_attachments/',
        verbose_name='Файл'
    )
    size = models.BigIntegerField(
        default=0,
        help_text='Размер вложения в байтах'
    )

    class Meta:
        verbose_name = 'Вложение к задаче'
        verbose_name_plural = 'Вложения к задачам'
        ordering = ['name']

    def __str__(self):
        return f'Вложение к задаче {self.task_id.task_id}'

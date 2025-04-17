from django.db import models
from .task import Task

class TaskAttachment(models.Model):
    """
    Модель для хранения вложений к задачам
    """
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='attachments',
        verbose_name='Задача'
    )
    file = models.FileField(
        upload_to='task_attachments/',
        verbose_name='Файл'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )

    class Meta:
        verbose_name = 'Вложение к задаче'
        verbose_name_plural = 'Вложения к задачам'
        ordering = ['-created_at']

    def __str__(self):
        return f'Вложение к задаче {self.task.id}' 
from django.db import models
from apps.users.models import User
from .task_status import TaskStatus
from .task_category import TaskCategory

class Task(models.Model):
    """
    Модель для задач.
    """
    PRIORITY_CHOICES = [
        ('low', 'Низкий'),
        ('medium', 'Средний'),
        ('high', 'Высокий'),
    ]

    title = models.CharField(
        max_length=255,
        help_text='Название задачи'
    )
    description = models.TextField(
        blank=True,
        help_text='Описание задачи'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks',
        help_text='Владелец задачи'
    )
    status = models.ForeignKey(
        TaskStatus,
        on_delete=models.CASCADE,
        related_name='tasks',
        help_text='Статус задачи'
    )
    category = models.ForeignKey(
        TaskCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks',
        help_text='Категория задачи'
    )
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='medium',
        help_text='Приоритет задачи'
    )
    deadline = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Срок выполнения'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='Дата создания'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text='Дата обновления'
    )

    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'
        ordering = ['-updated_at']

    def __str__(self):
        return self.title 
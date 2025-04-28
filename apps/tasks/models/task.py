from django.db import models
from django.utils import timezone
from apps.users.models import User
from .task_status import TaskStatus
from .task_category import TaskCategory
from apps.notes.models.note import Note


class Task(models.Model):
    """
    Модель для задач.
    """
    task_id = models.AutoField(primary_key=True, verbose_name='ID задачи')

    PRIORITY_CHOICES = [
        ('low', 'Низкий'),
        ('medium', 'Средний'),
        ('high', 'Высокий'),
        ('block', 'Блокер'),
    ]

    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks',
        help_text='Владелец задачи'
    )
    title = models.CharField(
        max_length=255,
        help_text='Название задачи'
    )
    description = models.TextField(
        blank=True,
        help_text='Описание задачи'
    )
    status_id = models.ForeignKey(
        TaskStatus,
        on_delete=models.CASCADE,
        related_name='tasks',
        help_text='Статус задачи'
    )
    category_id = models.ForeignKey(
        TaskCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks',
        help_text='Категория задачи'
    )
    note_id = models.ForeignKey(
        Note,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks',
        help_text='Заметка задачи'
    )
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='medium',
        help_text='Приоритет задачи'
    )
    deadline_start = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Начало срока выполнения'
    )
    deadline_end = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Конец срока выполнения'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def get_days_remaining(self):
        """
        Возвращает количество оставшихся дней до дедлайна.
        Если дедлайн уже прошел, возвращает отрицательное число.
        Если дедлайн не установлен, возвращает None.
        """
        if not self.deadline_end:
            return None
            
        now = timezone.now()
        delta = self.deadline_end - now
        return delta.days

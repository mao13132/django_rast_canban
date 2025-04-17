from django.db import models
from apps.users.models import User

class TaskCategory(models.Model):
    """
    Модель для категорий задач.
    """
    name = models.CharField(
        max_length=100,
        help_text='Название категории'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='task_categories',
        help_text='Владелец категории'
    )
    color = models.CharField(
        max_length=7,
        default='#000000',
        help_text='Цвет категории в HEX формате'
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
        verbose_name = 'Категория задачи'
        verbose_name_plural = 'Категории задач'
        ordering = ['name']
        unique_together = ['name', 'user']

    def __str__(self):
        return self.name 
from django.db import models
from apps.users.models import User


class TaskCategory(models.Model):
    """
    Модель для категорий задач.
    """
    category_id = models.AutoField(primary_key=True, verbose_name='ID категории')

    name = models.CharField(
        max_length=100,
        help_text='Название категории'
    )
    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='task_categories',
        help_text='Владелец категории'
    )

    class Meta:
        verbose_name = 'Категория задачи'
        verbose_name_plural = 'Категории задач'
        ordering = ['name']
        unique_together = ['name', 'user_id']

    def __str__(self):
        return self.name

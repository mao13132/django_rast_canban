from django.db import models
from apps.users.models import User

class TaskStatus(models.Model):
    """
    Модель для статусов задач.
    """
    name = models.CharField(
        max_length=100,
        help_text='Название статуса'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='task_statuses',
        help_text='Владелец статуса'
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text='Порядок отображения'
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
        verbose_name = 'Статус задачи'
        verbose_name_plural = 'Статусы задач'
        ordering = ['order']
        unique_together = ['name', 'user']

    def __str__(self):
        return self.name 
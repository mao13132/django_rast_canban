from django.db import models
from apps.users.models import User


class TaskStatus(models.Model):
    """
    Модель для статусов задач.
    """
    status_id = models.AutoField(primary_key=True, verbose_name='ID статуса')

    name = models.CharField(
        max_length=100,
        help_text='Название статуса'
    )
    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='task_statuses',
        help_text='Владелец статуса'
    )
    order = models.IntegerField(
        default=0,
        help_text='Порядок отображения статуса'
    )
    color = models.CharField(
        max_length=7,
        default='#A0A9F3',
        help_text='Цвет статуса в формате HEX'
    )

    class Meta:
        verbose_name = 'Статус задачи'
        verbose_name_plural = 'Статусы задач'
        ordering = ['order', 'name']
        unique_together = ['name', 'user_id']

    def __str__(self):
        return self.name

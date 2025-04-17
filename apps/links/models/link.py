from django.db import models
from apps.users.models import User

class Link(models.Model):
    """
    Модель для хранения ссылок пользователя.
    """
    url = models.URLField(
        max_length=2048,
        help_text='URL ссылки'
    )
    title = models.CharField(
        max_length=255,
        blank=True,
        help_text='Название ссылки'
    )
    description = models.TextField(
        blank=True,
        help_text='Описание ссылки'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='links',
        help_text='Владелец ссылки'
    )
    is_favorite = models.BooleanField(
        default=False,
        help_text='Пометка избранного'
    )
    is_trashed = models.BooleanField(
        default=False,
        help_text='Пометка удаления'
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
        verbose_name = 'Ссылка'
        verbose_name_plural = 'Ссылки'
        ordering = ['-updated_at']
        unique_together = ['url', 'user']

    def __str__(self):
        return self.title or self.url 
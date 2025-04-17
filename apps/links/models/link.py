from django.db import models
from apps.users.models import User


class Link(models.Model):
    """
    Модель для хранения ссылок пользователя.
    """
    link_id = models.AutoField(primary_key=True, verbose_name='ID ссылки')

    user_id = models.ManyToManyField(
        User,
        related_name='links',
        help_text='Владельцы ссылки'
    )
    url = models.URLField(
        max_length=2048,
        help_text='URL ссылки'
    )
    is_favorite = models.BooleanField(
        default=False,
        help_text='Пометка избранного'
    )
    is_trashed = models.BooleanField(
        default=False,
        help_text='Пометка удаления'
    )

    class Meta:
        verbose_name = 'Ссылка'
        verbose_name_plural = 'Ссылки'
        ordering = ['link_id']

    def __str__(self):
        return self.url

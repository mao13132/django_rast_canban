from django.db import models
from apps.users.models import User

class Note(models.Model):
    """
    Модель для хранения заметок пользователя.
    """
    title = models.CharField(
        max_length=255,
        help_text='Заголовок заметки'
    )
    content = models.TextField(
        help_text='Содержимое заметки'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notes',
        help_text='Владелец заметки'
    )
    is_pinned = models.BooleanField(
        default=False,
        help_text='Закреплена ли заметка'
    )
    is_archived = models.BooleanField(
        default=False,
        help_text='Архивирована ли заметка'
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
        verbose_name = 'Заметка'
        verbose_name_plural = 'Заметки'
        ordering = ['-updated_at']

    def __str__(self):
        return self.title 
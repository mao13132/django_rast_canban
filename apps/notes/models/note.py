from django.db import models
from apps.users.models import User


class Note(models.Model):
    """
    Модель для хранения заметок пользователя.
    """
    note_id = models.AutoField(primary_key=True, verbose_name='ID заметки')

    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notes',
        help_text='Владелец заметки'
    )
    title = models.CharField(
        max_length=255,
        help_text='Заголовок заметки'
    )
    content = models.TextField(
        help_text='Содержимое заметки'
    )
    is_pinned = models.BooleanField(
        default=False,
        help_text='Закреплена ли заметка'
    )
    is_archived = models.BooleanField(
        default=False,
        help_text='Архивирована ли заметка'
    )

    class Meta:
        verbose_name = 'Заметка'
        verbose_name_plural = 'Заметки'

    def __str__(self):
        return self.title

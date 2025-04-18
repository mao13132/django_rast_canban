from django.db import models
from apps.users.models import User


class Folder(models.Model):
    """
    Модель для хранения папок пользователя.
    """
    folder_id = models.AutoField(primary_key=True, verbose_name='ID папки')

    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='folders',
        help_text='Владелец папки'
    )
    name = models.CharField(
        max_length=255,
        help_text='Название папки'
    )
    parent_id = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        help_text='Родительская папка'
    )
    is_favorite = models.BooleanField(
        default=False,
        help_text='Пометка избранного'
    )
    is_trashed = models.BooleanField(
        default=False,
        help_text='Пометка удаления'
    )
    size = models.BigIntegerField(
        default=0,
        help_text='Размер папки в байтах'
    )

    class Meta:
        verbose_name = 'Папка'
        verbose_name_plural = 'Папки'
        ordering = ['folder_id']
        unique_together = ['name', 'parent_id', 'user_id']

    def __str__(self):
        return self.name

    def get_full_path(self):
        """
        Возвращает полный путь к папке через родителей
        """
        if self.parent_id:
            return f"{self.parent_id.get_full_path()}/{self.name}"
        return self.name

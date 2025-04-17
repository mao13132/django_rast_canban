from django.db import models
from apps.users.models import User

class Folder(models.Model):
    """
    Модель папки для хранения файлов.
    Поддерживает иерархическую структуру через parent_id.
    """
    name = models.CharField(
        max_length=255,
        help_text='Название папки'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='folders',
        help_text='Владелец папки'
    )
    parent = models.ForeignKey(
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
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='Дата создания'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text='Дата обновления'
    )

    class Meta:
        verbose_name = 'Папка'
        verbose_name_plural = 'Папки'
        ordering = ['-updated_at']
        unique_together = ['name', 'parent', 'user']

    def __str__(self):
        return self.name

    def get_full_path(self):
        """
        Возвращает полный путь к папке через родителей
        """
        if self.parent:
            return f"{self.parent.get_full_path()}/{self.name}"
        return self.name 
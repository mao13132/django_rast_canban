from django.db import models
from apps.users.models import User
from .folder import Folder

class File(models.Model):
    """
    Модель файла.
    Файлы хранятся в папках и принадлежат пользователям.
    """
    name = models.CharField(
        max_length=255,
        help_text='Название файла'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='files',
        help_text='Владелец файла'
    )
    folder = models.ForeignKey(
        Folder,
        on_delete=models.CASCADE,
        related_name='files',
        null=True,
        blank=True,
        help_text='Папка, в которой находится файл'
    )
    file = models.FileField(
        upload_to='files/%Y/%m/%d/',
        help_text='Файл'
    )
    size = models.BigIntegerField(
        help_text='Размер файла в байтах'
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
        verbose_name = 'Файл'
        verbose_name_plural = 'Файлы'
        ordering = ['-updated_at']
        unique_together = ['name', 'folder', 'user']

    def __str__(self):
        return self.name

    def get_full_path(self):
        """
        Возвращает полный путь к файлу через папку
        """
        if self.folder:
            return f"{self.folder.get_full_path()}/{self.name}"
        return self.name 
from django.db import models
from apps.users.models import User
from .folder import Folder


class File(models.Model):
    """
    Модель для хранения файлов пользователя.
    """
    file_id = models.AutoField(primary_key=True, verbose_name='ID файла')

    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='files',
        help_text='Владелец файла'
    )
    name = models.CharField(
        max_length=255,
        help_text='Название файла'
    )
    folder_id = models.ForeignKey(
        Folder,
        on_delete=models.CASCADE,
        related_name='files',
        help_text='Папка файла',
        null=True,  # Добавляем null=True
        blank=True  # Добавляем blank=True
    )
    file = models.FileField(
        upload_to='files/',
        help_text='Файл'
    )
    size = models.BigIntegerField(
        default=0,
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

    class Meta:
        verbose_name = 'Файл'
        verbose_name_plural = 'Файлы'
        ordering = ['file_id']
        unique_together = ['name', 'folder_id']

    def __str__(self):
        return self.name

    def get_full_path(self):
        """
        Возвращает полный путь к файлу через папку
        """
        if self.folder:
            return f"{self.folder.get_full_path()}/{self.name}"
        return self.name

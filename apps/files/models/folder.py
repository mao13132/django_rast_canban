from django.db import models
from apps.users.models import User
from django.db import transaction


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
        return f"/{self.name}"  # Добавляем слеш для корневых папок

    def update_size(self, visited_folders=None):
        """
        Пересчитывает размер папки с защитой от рекурсии
        :param visited_folders: set - отслеживание посещенных папок
        """
        if visited_folders is None:
            visited_folders = set()
        
        if self.pk in visited_folders:
            return self.size
            
        visited_folders.add(self.pk)
        total_size = 0
        
        # Суммируем размеры файлов
        for file in self.files.all():
            total_size += file.size
            
        # Суммируем размеры подпапок без рекурсии
        for subfolder in self.children.all():
            if subfolder.pk not in visited_folders:
                total_size += subfolder.size
        
        self.size = total_size
        self.save()
        return total_size

    def save(self, *args, **kwargs):
        """
        Сохраняет папку без автоматического обновления родителя
        """
        super().save(*args, **kwargs)
        
        # Вручную обновляем размер через задачу Celery или сигнал
        # чтобы избежать рекурсии
        if self.parent_id:
            from django.db import transaction
            transaction.on_commit(
                lambda: self.parent_id.update_size()
            )

    def save(self, *args, **kwargs):
        """
        Переопределяем метод save для обновления размера родительской папки
        с обработкой транзакций
        """
        super().save(*args, **kwargs)
        
        # Обновляем размер родительской папки в отдельной транзакции
        if self.parent_id:
            try:
                with transaction.atomic():
                    self.parent_id.update_size()
            except Exception as e:
                print(f"Ошибка при обновлении размера родительской папки: {e}")

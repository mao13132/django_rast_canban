from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Кастомная модель пользователя.
    Наследуется от AbstractUser для использования стандартной аутентификации Django.
    """
    email = models.EmailField(
        'email address',
        unique=True,
        help_text='Электронная почта пользователя'
    )
    first_name = models.CharField(
        'first name',
        max_length=150,
        help_text='Имя пользователя'
    )
    last_name = models.CharField(
        'last name',
        max_length=150,
        help_text='Фамилия пользователя'
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['-date_joined']

    def __str__(self):
        return f'{self.first_name} {self.last_name} ({self.email})' 
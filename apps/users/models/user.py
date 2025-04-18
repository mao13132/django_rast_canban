from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """
    Кастомный менеджер пользователей.
    Переопределяет стандартные методы для работы с email вместо username.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Создает и сохраняет пользователя с указанным email и паролем.
        """
        if not email:
            raise ValueError('Email обязателен')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Создает и сохраняет суперпользователя с указанным email и паролем.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Кастомная модель пользователя.
    Наследуется от AbstractUser для использования стандартной аутентификации Django.
    Требует только email и пароль для регистрации.
    """
    email = models.EmailField(
        'email address',
        unique=True,
        help_text='Электронная почта пользователя'
    )

    # Удаляем обязательные поля first_name и last_name
    first_name = models.CharField(
        'first name',
        max_length=150,
        blank=True,
        null=True,
        help_text='Имя пользователя'
    )
    last_name = models.CharField(
        'last name',
        max_length=150,
        blank=True,
        null=True,
        help_text='Фамилия пользователя'
    )

    # Убираем username из обязательных полей
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # Убираем все обязательные поля кроме email

    objects = UserManager()  # Используем кастомный менеджер

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['-date_joined']

    def __str__(self):
        return self.email  # Упрощаем строковое представление

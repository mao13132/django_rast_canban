# Django REST Canban API

Backend-приложение на Django с REST API для управления задачами, файлами, заметками и ссылками.

## Технологии

- Django 4.x
- Django REST Framework
- MySQL 8+
- djoser (для авторизации)
- drf-spectacular (для OpenAPI-документации)

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/django-rest-canban.git
cd django-rest-canban
```

2. Создайте виртуальное окружение и активируйте его:
```bash
python -m venv venv
source venv/bin/activate  # для Linux/Mac
venv\Scripts\activate     # для Windows
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Создайте файл .env на основе .env.example и настройте переменные окружения.

5. Создайте базу данных MySQL:
```sql
CREATE DATABASE canban_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

6. Примените миграции:
```bash
python manage.py migrate
```

7. Создайте суперпользователя:
```bash
python manage.py createsuperuser
```

8. Запустите сервер разработки:
```bash
python manage.py runserver
```

## API Endpoints

### Аутентификация
- POST /api/v1/auth/token/login/ - Получение JWT токена
- POST /api/v1/auth/token/refresh/ - Обновление JWT токена
- POST /api/v1/auth/token/logout/ - Выход

### Пользователи
- GET /api/v1/users/me/ - Получение информации о текущем пользователе
- PUT /api/v1/users/me/ - Обновление информации о текущем пользователе

### Файлы и папки
- GET /api/v1/files/folders/ - Список папок
- POST /api/v1/files/folders/ - Создание папки
- GET /api/v1/files/files/ - Список файлов
- POST /api/v1/files/files/ - Загрузка файла

### Ссылки
- GET /api/v1/links/links/ - Список ссылок
- POST /api/v1/links/links/ - Создание ссылки

### Заметки
- GET /api/v1/notes/notes/ - Список заметок
- POST /api/v1/notes/notes/ - Создание заметки

### Задачи
- GET /api/v1/tasks/tasks/ - Список задач
- POST /api/v1/tasks/tasks/ - Создание задачи
- GET /api/v1/tasks/statuses/ - Список статусов
- POST /api/v1/tasks/statuses/ - Создание статуса
- GET /api/v1/tasks/categories/ - Список категорий
- POST /api/v1/tasks/categories/ - Создание категории
- GET /api/v1/tasks/attachments/ - Список вложений
- POST /api/v1/tasks/attachments/ - Загрузка вложения

## Документация API

Документация API доступна по адресу:
- Swagger UI: /api/docs/
- OpenAPI Schema: /api/schema/

## Лицензия

MIT 
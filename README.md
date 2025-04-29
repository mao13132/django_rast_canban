# Django REST Kanban

## Описание проекта
Это Kanban-доска, реализованная с использованием Django REST Framework. Проект позволяет управлять задачами в стиле Kanban-методологии.

## Требования
- Python 3.8+
- Django 4.x
- Django REST Framework

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone <your-repository-url>
cd django_rest_canban
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

## Структура проекта

### Frontend (React)

```
frontend/
├── src/
│   ├── components/           # React компоненты
│   │   ├── Profile/         # Компоненты профиля
│   │   │   ├── ProfileHeader/    # Шапка профиля
│   │   │   ├── ProfileInfo/      # Информация профиля
│   │   │   ├── ProfileActions/   # Действия профиля
│   │   │   ├── ProfileEditForm/  # Форма редактирования
│   │   │   ├── ProfilePasswordForm/ # Форма пароля
│   │   │   └── ProfileEditActions/  # Действия редактирования
│   │   ├── Files/          # Компоненты файлового хранилища
│   │   │   ├── FileSearch/       # Поиск файлов
│   │   │   ├── FileNavigation/   # Навигация по файлам
│   │   │   ├── FileList/         # Список файлов
│   │   │   ├── FileItem/         # Элемент файла
│   │   │   └── StorageInfo/      # Информация о хранилище
│   │   ├── EditNote/        # Компоненты для работы с заметками
│   │   │   ├── NoteEdit/    # Компонент редактирования
│   │   │   ├── NoteView/    # Компонент просмотра
│   │   │   └── EditNoteForm/# Форма редактирования
│   │   ├── ArchiveNotes/    # Компоненты для работы с архивом
│   │   │   ├── SearchBar/   # Поиск в архиве
│   │   │   ├── ArchivedNoteList/ # Список архивных заметок
│   │   │   └── ArchivedNoteCard/ # Карточка архивной заметки
│   │   ├── Notes/          # Компоненты для работы с заметками
│   │   │   ├── SearchBar/  # Поиск заметок
│   │   │   ├── NoteForm/   # Форма создания заметки
│   │   │   ├── NoteList/   # Список заметок
│   │   │   └── NoteCard/   # Карточка заметки
│   │   ├── Filter/         # Компонент фильтрации
│   │   ├── Notification/   # Компонент уведомлений
│   │   ├── Task/          # Компоненты для работы с задачами
│   │   │   ├── TaskForm/  # Форма создания задачи
│   │   │   ├── TaskItem/  # Элемент задачи
│   │   │   ├── TaskColumn/# Колонка задач
│   │   │   └── TaskCard/  # Карточка задачи
│   │   ├── Header/        # Шапка приложения
│   │   │   └── Navigation/# Навигация
│   │   ├── UI/           # UI компоненты
│   │   │   ├── SearchBar/# Общий компонент поиска
│   │   │   └── PrivateRoute/ # Защищенный маршрут
│   │   ├── Auth/         # Компоненты авторизации
│   │   │   ├── RegisterForm/ # Форма регистрации
│   │   │   └── LoginForm/   # Форма входа
│   │   └── Popup/        # Компонент всплывающего окна
│   ├── pages/            # Страницы приложения
│   │   ├── Profile/      # Страница профиля
│   │   ├── ProfileEdit/  # Страница редактирования профиля
│   │   ├── Files/        # Страница файлового хранилища
│   │   ├── FavoriteFiles/# Страница избранных файлов
│   │   ├── TrashFiles/   # Страница корзины файлов
│   │   ├── Dashboard/    # Главная страница
│   │   ├── Notes/        # Страница заметок
│   │   ├── ArchiveNotes/ # Страница архива
│   │   └── EditNote/     # Страница редактирования заметки
│   ├── routes/          # Маршрутизация
│   │   └── AppRoutes.jsx # Основные маршруты приложения
│   ├── context/         # React контексты
│   ├── services/        # Сервисы для работы с API
│   ├── store/           # Управление состоянием
│   ├── styles/          # Глобальные стили
│   └── assets/          # Статические ресурсы
```

### Backend (Django)

```
├── apps/                    # Django приложения
├── core/                    # Основные настройки
├── django_rest_canban/      # Конфигурация проекта
└── manage.py               # Скрипт управления Django
```

## Компоненты

### Профиль
- **Profile/** - Компоненты для работы с профилем
  - `ProfileHeader/` - Шапка профиля с аватаром
  - `ProfileInfo/` - Информация о пользователе
  - `ProfileActions/` - Кнопки действий
  - `ProfileEditForm/` - Форма редактирования данных
  - `ProfilePasswordForm/` - Форма изменения пароля
  - `ProfileEditActions/` - Кнопки сохранения/отмены

### Файловое хранилище
- **Files/** - Компоненты для работы с файлами
  - `FileSearch/` - Поиск файлов
  - `FileNavigation/` - Навигация (Избранное, Создать, Корзина)
  - `FileList/` - Список файлов
  - `FileItem/` - Элемент файла
  - `StorageInfo/` - Информация о хранилище

### Заметки
- **EditNote/** - Компоненты для редактирования заметок
  - `NoteEdit/` - Редактирование заметки
  - `NoteView/` - Просмотр заметки
  - `EditNoteForm/` - Форма редактирования

- **ArchiveNotes/** - Компоненты для работы с архивом
  - `SearchBar/` - Поиск в архиве
  - `ArchivedNoteList/` - Список архивных заметок
  - `ArchivedNoteCard/` - Карточка архивной заметки

- **Notes/** - Основные компоненты заметок
  - `SearchBar/` - Поиск заметок
  - `NoteForm/` - Форма создания
  - `NoteList/` - Список заметок
  - `NoteCard/` - Карточка заметки

### Задачи
- **Task/** - Компоненты для работы с задачами
  - `TaskForm/` - Форма создания задачи
  - `TaskItem/` - Элемент задачи
  - `TaskColumn/` - Колонка задач
  - `TaskCard/` - Карточка задачи

### Общие компоненты
- **Header/** - Шапка приложения
  - `Navigation/` - Навигация
- **UI/** - UI компоненты
  - `SearchBar/` - Общий компонент поиска
  - `PrivateRoute/` - Защищенный маршрут
- **Auth/** - Авторизация
  - `RegisterForm/` - Регистрация
  - `LoginForm/` - Вход
- **Popup/** - Всплывающие окна
- **Filter/** - Фильтрация
- **Notification/** - Уведомления

## Маршрутизация

### Основные маршруты
- `/` - Главная страница (Dashboard)
- `/dashboard` - Главная страница
- `/notes` - Страница заметок
- `/archive` - Страница архива
- `/notes/:id/edit` - Страница редактирования заметки
- `/files` - Страница файлового хранилища
- `/files/favorite` - Страница избранных файлов
- `/files/trash` - Страница корзины файлов
- `/profile` - Страница профиля
- `/profile/edit` - Страница редактирования профиля
- `*` - Редирект на главную страницу
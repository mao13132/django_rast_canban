const API_BASE_URL = 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  
  // Аутентификация
  LOGIN: `${API_BASE_URL}/auth/jwt/create/`,
  REGISTER: `${API_BASE_URL}/auth/users/`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/jwt/refresh/`,
  USER: `${API_BASE_URL}/auth/users/me/`,
  SET_PASSWORD: `${API_BASE_URL}/auth/users/set_password/`,
  
  // Профиль
  PROFILE: `${API_BASE_URL}/users/users/me/`,
  
  // Задачи
  TASKS: `${API_BASE_URL}/tasks/tasks/`,
  TASK: (id) => `${API_BASE_URL}/tasks/tasks/${id}/`,
  BULK_UPDATE_TASKS: `${API_BASE_URL}/tasks/tasks/bulk_update/`,
  BULK_DELETE_TASKS: `${API_BASE_URL}/tasks/tasks/bulk_delete/`,
  
  // Категории
  CATEGORIES: `${API_BASE_URL}/tasks/categories/`,
  CATEGORY: (id) => `${API_BASE_URL}/tasks/categories/${id}/`,
  
  // Статусы
  STATUSES: `${API_BASE_URL}/tasks/statuses/`,
  STATUS: (id) => `${API_BASE_URL}/tasks/statuses/${id}/`,
  
  // Заметки
  NOTES: `${API_BASE_URL}/notes/notes/`,
  NOTE: (id) => `${API_BASE_URL}/notes/notes/${id}/`,
  
  // Вложения
  ATTACHMENTS: `${API_BASE_URL}/tasks/attachments/`,
  ATTACHMENT: (id) => `${API_BASE_URL}/tasks/attachments/${id}/`,
  ATTACHMENT_DOWNLOAD: (id) => `${API_BASE_URL}/tasks/attachments/${id}/download/`,
  
  // Файлы и папки
  FILES: `${API_BASE_URL}/files/files/`,
  FILE: (id) => `${API_BASE_URL}/files/files/${id}/`,
  FILE_TOGGLE_FAVORITE: (id) => `${API_BASE_URL}/files/files/${id}/toggle_favorite/`,
  FILE_DOWNLOAD: (id) => `${API_BASE_URL}/files/files/${id}/download/`,
  FILE_TOTAL_SIZE: `${API_BASE_URL}/files/files/total_size/`,
  FOLDERS: `${API_BASE_URL}/files/folders/`,
  FOLDER: (id) => `${API_BASE_URL}/files/folders/${id}/`,
  FOLDER_UPLOAD: `${API_BASE_URL}/files/folders/upload/`,
  FOLDER_DOWNLOAD: (id) => `${API_BASE_URL}/files/folders/${id}/download/`,
  
  // Ссылки
  LINKS: `${API_BASE_URL}/links/links/`,
  LINK: (id) => `${API_BASE_URL}/links/links/${id}/`,
  LINK_TOGGLE_FAVORITE: (id) => `${API_BASE_URL}/links/links/${id}/toggle_favorite/`,
  LINK_TOGGLE_TRASHED: (id) => `${API_BASE_URL}/links/links/${id}/toggle_trashed/`,
};
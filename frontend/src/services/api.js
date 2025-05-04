import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Создаем экземпляр axios с базовым URL и настройками
const axiosInstance = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик для добавления токена авторизации
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Если отправляем FormData, удаляем Content-Type, чтобы браузер сам установил правильный
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Перехватчик для обработки ошибок
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка авторизации и запрос не повторялся
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Получаем новый токен с помощью refresh токена
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(API_ENDPOINTS.REFRESH_TOKEN, { refresh: refreshToken });

          if (response.data.access) {
            localStorage.setItem('accessToken', response.data.access);
            // Повторяем исходный запрос с новым токеном
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        // Если обновление токена не удалось, выходим из системы
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    return Promise.reject(error);
  }
);

// API методы аутентификации
export const authAPI = {
  login: (email, password) =>
    axiosInstance.post(API_ENDPOINTS.LOGIN, { email, password }),
  register: (userData) =>
    axiosInstance.post(API_ENDPOINTS.REGISTER, {
      email: userData.email,
      password: userData.password,
      re_password: userData.re_password
    }),
  getUser: () =>
    axiosInstance.get(API_ENDPOINTS.USER),
};

// API методы для работы с пользователями
export const usersAPI = {
  getProfile: () =>
    axiosInstance.get(API_ENDPOINTS.PROFILE),
  updateProfile: (userData) =>
    axiosInstance.patch(API_ENDPOINTS.PROFILE, userData),
};

// API методы для работы с задачами
export const tasksAPI = {
  getTasks: (params = {}) =>
    axiosInstance.get(API_ENDPOINTS.TASKS, { params }),
  getTask: (taskId) =>
    axiosInstance.get(API_ENDPOINTS.TASK(taskId)),
  createTask: (formData) =>
    axiosInstance.post(API_ENDPOINTS.TASKS, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  updateTask: (taskId, taskData) =>
    axiosInstance.put(API_ENDPOINTS.TASK(taskId), taskData),
  deleteTask: (taskId) =>
    axiosInstance.delete(API_ENDPOINTS.TASK(taskId)),
  updateTaskStatus: (taskId, status) =>
    axiosInstance.patch(API_ENDPOINTS.TASK(taskId), { status_id: status }),
  getFilteredTasks: (params) =>
    axiosInstance.get(API_ENDPOINTS.TASKS, { params }),
  bulkUpdateTasks: (taskIds, updateData) =>
    axiosInstance.patch(API_ENDPOINTS.BULK_UPDATE_TASKS, {
      ids: taskIds,
      ...updateData
    }),
  bulkDeleteTasks: (taskIds) =>
    axiosInstance.post(API_ENDPOINTS.BULK_DELETE_TASKS, {
      ids: taskIds
    }),
};

// API методы для работы со статусами задач
export const statusesAPI = {
  getStatuses: () =>
    axiosInstance.get(API_ENDPOINTS.STATUSES),
  createStatus: (statusData) =>
    axiosInstance.post(API_ENDPOINTS.STATUSES, statusData),
  updateStatus: (statusId, statusData) =>
    axiosInstance.patch(API_ENDPOINTS.STATUS(statusId), statusData),
  deleteStatus: (statusId) =>
    axiosInstance.delete(API_ENDPOINTS.STATUS(statusId)),
};

// API методы для работы с категориями задач
export const categoriesAPI = {
  getCategories: () =>
    axiosInstance.get(API_ENDPOINTS.CATEGORIES),
  createCategory: (categoryData) =>
    axiosInstance.post(API_ENDPOINTS.CATEGORIES, categoryData),
  updateCategory: (categoryId, categoryData) =>
    axiosInstance.patch(API_ENDPOINTS.CATEGORY(categoryId), categoryData),
  deleteCategory: (categoryId) =>
    axiosInstance.delete(API_ENDPOINTS.CATEGORY(categoryId)),
};

// API методы для работы с заметками
export const notesAPI = {
  getNotes: () =>
    axiosInstance.get(API_ENDPOINTS.NOTES),
  getNote: (noteId) =>
    axiosInstance.get(API_ENDPOINTS.NOTE(noteId)),
  createNote: (noteData) =>
    axiosInstance.post(API_ENDPOINTS.NOTES, noteData),
  updateNote: (noteId, noteData) =>
    axiosInstance.put(API_ENDPOINTS.NOTE(noteId), noteData),
  deleteNote: (noteId) =>
    axiosInstance.delete(API_ENDPOINTS.NOTE(noteId)),
};

// API методы для работы с вложениями
export const attachmentsAPI = {
  getAttachments: () =>
    axiosInstance.get(API_ENDPOINTS.ATTACHMENTS),
  createAttachment: (attachmentData) =>
    axiosInstance.post(API_ENDPOINTS.ATTACHMENTS, attachmentData),
  deleteAttachment: (attachmentId) =>
    axiosInstance.delete(API_ENDPOINTS.ATTACHMENT(attachmentId)),
  downloadAttachment: (attachmentId) =>
    axiosInstance.get(API_ENDPOINTS.ATTACHMENT_DOWNLOAD(attachmentId), {
      responseType: 'blob'
    }),
};

export const foldersAPI = {
  getFolders: (parentId = null) =>
    axiosInstance.get(API_ENDPOINTS.FOLDERS, { params: { parent_id: parentId } }),

  getFolder: (folderId) =>
    axiosInstance.get(API_ENDPOINTS.FOLDER(folderId)),

  getFolderByName: (name) =>
    axiosInstance.get(API_ENDPOINTS.FOLDERS, { params: { name } }),

  createFolder: (folderData) =>
    axiosInstance.post(API_ENDPOINTS.FOLDERS, folderData),

  updateFolder: (folderId, folderData) =>
    axiosInstance.put(API_ENDPOINTS.FOLDER(folderId), folderData),

  deleteFolder: (folderId) =>
    axiosInstance.delete(API_ENDPOINTS.FOLDER(folderId)),
    
  toggleFolderFavorite: (folderId) =>
    axiosInstance.post(`${API_ENDPOINTS.FOLDER(folderId)}toggle_favorite/`)
};

export const filesAPI = {
  getFiles: (params = {}) =>
    axiosInstance.get(API_ENDPOINTS.FILES, { params }),

  getFile: (fileId) =>
    axiosInstance.get(API_ENDPOINTS.FILE(fileId)),

  toggleFileFavorite: (fileId) =>
    axiosInstance.post(API_ENDPOINTS.FILE_TOGGLE_FAVORITE(fileId)),

  uploadFile: (fileData) => {
    const formData = new FormData();
    formData.append('file', fileData.file);
    formData.append('name', fileData.name);
    formData.append('folder_id', fileData.folder_id);
    formData.append('is_favorite', fileData.is_favorite);
    formData.append('is_trashed', fileData.is_trashed);

    return axiosInstance.post(API_ENDPOINTS.FILES, formData);
  },

  updateFile: (fileId, fileData) =>
    axiosInstance.put(API_ENDPOINTS.FILE(fileId), fileData),

  deleteFile: (fileId) =>
    axiosInstance.delete(API_ENDPOINTS.FILE(fileId))
};

export const folderUploadAPI = {
  uploadFolderWithFiles: async (formData) => {
    return axiosInstance.post(API_ENDPOINTS.FOLDER_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// API методы для работы со ссылками
export const linksAPI = {
  getLinks: (params = {}) =>
    axiosInstance.get(API_ENDPOINTS.LINKS, { params }),

  getLink: (linkId) =>
    axiosInstance.get(API_ENDPOINTS.LINK(linkId)),

  createLink: (linkData) =>
    axiosInstance.post(API_ENDPOINTS.LINKS, linkData),

  updateLink: (linkId, linkData) =>
    axiosInstance.put(API_ENDPOINTS.LINK(linkId), linkData),

  deleteLink: (linkId) =>
    axiosInstance.delete(API_ENDPOINTS.LINK(linkId)),
};

export default axiosInstance;
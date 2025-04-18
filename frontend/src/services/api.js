import axios from 'axios';

// Создаем экземпляр axios с базовым URL и настройками
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
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
          const response = await axios.post(
            'http://localhost:8000/api/v1/auth/jwt/refresh/', 
            { refresh: refreshToken }
          );
          
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
    axiosInstance.post('auth/jwt/create/', { email, password }),
  register: (userData) => 
    axiosInstance.post('auth/users/', {
      email: userData.email,
      password: userData.password,
      re_password: userData.re_password
    }),
  getUser: () => 
    axiosInstance.get('auth/users/me/'),
};

// API методы для работы с пользователями
export const usersAPI = {
  getProfile: () => 
    axiosInstance.get('users/users/me/'),
  updateProfile: (userData) => 
    axiosInstance.patch('users/users/me/', userData),
};

// API методы для работы с задачами
export const tasksAPI = {
  getTasks: () => 
    axiosInstance.get('tasks/tasks/'),
  getTask: (taskId) => 
    axiosInstance.get(`tasks/tasks/${taskId}/`),
  createTask: (taskData) => 
    axiosInstance.post('tasks/tasks/', taskData),
  updateTask: (taskId, taskData) => 
    axiosInstance.patch(`tasks/tasks/${taskId}/`, taskData),
  deleteTask: (taskId) => 
    axiosInstance.delete(`tasks/tasks/${taskId}/`),
};

// API методы для работы со статусами задач
export const statusesAPI = {
  getStatuses: () => 
    axiosInstance.get('tasks/statuses/'),
  createStatus: (statusData) => 
    axiosInstance.post('tasks/statuses/', statusData),
  updateStatus: (statusId, statusData) => 
    axiosInstance.patch(`tasks/statuses/${statusId}/`, statusData),
  deleteStatus: (statusId) => 
    axiosInstance.delete(`tasks/statuses/${statusId}/`),
};

// API методы для работы с категориями задач
export const categoriesAPI = {
  getCategories: () => 
    axiosInstance.get('tasks/categories/'),
  createCategory: (categoryData) => 
    axiosInstance.post('tasks/categories/', categoryData),
  updateCategory: (categoryId, categoryData) => 
    axiosInstance.patch(`tasks/categories/${categoryId}/`, categoryData),
  deleteCategory: (categoryId) => 
    axiosInstance.delete(`tasks/categories/${categoryId}/`),
};

// API методы для работы с вложениями
export const attachmentsAPI = {
  getAttachments: () => 
    axiosInstance.get('tasks/attachments/'),
  createAttachment: (attachmentData) => 
    axiosInstance.post('tasks/attachments/', attachmentData),
  deleteAttachment: (attachmentId) => 
    axiosInstance.delete(`tasks/attachments/${attachmentId}/`),
};

export default axiosInstance; 
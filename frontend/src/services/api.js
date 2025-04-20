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
    axiosInstance.get('tasks/tasks/').then(response => ({
      data: response.data.map(task => ({
        id: task.task_id,
        title: task.title,
        description: task.description,
        status: task.status_id,
        category: task.category_id,
        priority: task.priority,
        deadline: task.deadline,
        attachments: task.attachments || [],
        user_id: task.user_id
      }))
    })),
  getTask: (taskId) => 
    axiosInstance.get(`tasks/tasks/${taskId}/`).then(response => ({
      id: response.data.task_id,
      title: response.data.title,
      description: response.data.description,
      status: response.data.status_id,
      category: response.data.category_id,
      priority: response.data.priority,
      deadline: response.data.deadline,
      attachments: response.data.attachments || [],
      user_id: response.data.user_id
    })),
  createTask: async (formData) => {
    try {
      console.log('Submitting formData:', formData);
      
      // Логируем содержимое FormData перед отправкой
      console.log('FormData contents before sending:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      const response = await axiosInstance.post('/tasks/tasks/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },
  updateTask: (taskId, taskData) => 
    axiosInstance.put(`tasks/tasks/${taskId}/`, taskData).then(response => ({
      id: response.data.task_id,
      title: response.data.title,
      description: response.data.description,
      status: response.data.status_id,
      category: response.data.category_id,
      priority: response.data.priority,
      deadline: response.data.deadline,
      attachments: response.data.attachments
    })),
  deleteTask: (taskId) => 
    axiosInstance.delete(`tasks/tasks/${taskId}/`),
  updateTaskStatus: (taskId, status) => 
    axiosInstance.patch(`tasks/tasks/${taskId}/`, { status_id: status }).then(response => ({
      id: response.data.task_id,
      title: response.data.title,
      description: response.data.description,
      status: response.data.status_id,
      category: response.data.category_id,
      priority: response.data.priority,
      deadline: response.data.deadline,
      attachments: response.data.attachments
    })),
  getFilteredTasks: (params) => 
    axiosInstance.get('tasks/tasks/', { params }).then(response => ({
      data: response.data.map(task => ({
        id: task.task_id,
        title: task.title,
        description: task.description,
        status: task.status_id,
        category: task.category_id,
        priority: task.priority,
        deadline: task.deadline,
        attachments: task.attachments
      }))
    })),
  bulkUpdateTasks: (taskIds, updateData) => 
    axiosInstance.patch('tasks/tasks/bulk_update/', { 
      ids: taskIds, 
      ...updateData 
    }),
  bulkDeleteTasks: (taskIds) => 
    axiosInstance.post('tasks/tasks/bulk_delete/', { 
      ids: taskIds 
    }),
};

// API методы для работы со статусами задач
export const statusesAPI = {
  getStatuses: () => 
    axiosInstance.get('tasks/statuses/').then(response => ({
      data: response.data.map(status => ({
        id: status.status_id,
        name: status.name,
        user_id: status.user_id
      }))
    })),
  createStatus: (statusData) => 
    axiosInstance.post('tasks/statuses/', statusData).then(response => ({
      id: response.data.status_id,
      name: response.data.name,
      user_id: response.data.user_id
    })),
  updateStatus: (statusId, statusData) => 
    axiosInstance.patch(`tasks/statuses/${statusId}/`, statusData).then(response => ({
      id: response.data.status_id,
      name: response.data.name,
      user_id: response.data.user_id
    })),
  deleteStatus: (statusId) => 
    axiosInstance.delete(`tasks/statuses/${statusId}/`),
};

// API методы для работы с категориями задач
export const categoriesAPI = {
  getCategories: () => 
    axiosInstance.get('tasks/categories/').then(response => ({
      data: response.data.map(category => ({
        id: category.category_id,
        name: category.name,
        user_id: category.user_id
      }))
    })),
  createCategory: (categoryData) => 
    axiosInstance.post('tasks/categories/', categoryData).then(response => ({
      id: response.data.category_id,
      name: response.data.name,
      user_id: response.data.user_id
    })),
  updateCategory: (categoryId, categoryData) => 
    axiosInstance.patch(`tasks/categories/${categoryId}/`, categoryData).then(response => ({
      id: response.data.category_id,
      name: response.data.name,
      user_id: response.data.user_id
    })),
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
  downloadAttachment: (attachmentId) => 
    axiosInstance.get(`tasks/attachments/${attachmentId}/download/`, {
      responseType: 'blob'
    }),
};

export default axiosInstance; 
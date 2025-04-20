import { create } from 'zustand';
import { tasksAPI, categoriesAPI, statusesAPI, attachmentsAPI } from '../services/api';

// Вспомогательные функции для определения статуса и категории
const getStatusId = (status) => {
  if (!status) return null;
  if (typeof status === 'object' && status.id) return status.id;
  if (typeof status === 'string') return status;
  return null;
};

const getCategoryId = (category) => {
  if (!category) return null;
  if (typeof category === 'object' && category.id) return category.id;
  if (typeof category === 'string') return category;
  return null;
};

// Вспомогательная функция для преобразования данных задачи
const transformTaskData = (taskData) => {
  const newData = {
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority,
    status_id: getStatusId(taskData.status),
    category_id: getCategoryId(taskData.category),
    deadline_start: taskData.deadline?.start,
    deadline_end: taskData.deadline?.end
  };

  return newData;
};

// Вспомогательная функция для создания FormData
const createFormData = (data, files = []) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('attachments', file);
    });
  }

  return formData;
};

export const useTaskStore = create((set, get) => ({
  // Состояние
  tasks: [],
  filteredTasks: [],
  categories: [],
  statuses: [],
  loading: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    search: '',
    category: '',
    dateRange: {
      start: '',
      end: ''
    }
  },

  // Действия
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),

  // Получение всех задач
  fetchTasks: async () => {
    try {
      set({ loading: true });
      const response = await tasksAPI.getTasks();
      set({ tasks: response.data, error: null });
    } catch (err) {
      console.error('Ошибка при загрузке задач:', err);
      set({ error: 'Ошибка при загрузке задач', tasks: [] });
    } finally {
      set({ loading: false });
    }
  },

  // Получение категорий
  fetchCategories: async () => {
    try {
      set({ loading: true });
      const response = await categoriesAPI.getCategories();
      set({ categories: response.data });
    } catch (err) {
      console.error('Ошибка при загрузке категорий:', err);
      set({ categories: [] });
    } finally {
      set({ loading: false });
    }
  },

  // Получение статусов
  fetchStatuses: async () => {
    try {
      set({ loading: true });
      const response = await statusesAPI.getStatuses();
      set({ statuses: response.data });
    } catch (err) {
      console.error('Ошибка при загрузке статусов:', err);
      set({ statuses: [] });
    } finally {
      set({ loading: false });
    }
  },

  // Создание задачи
  createTask: async (taskData) => {
    try {
      const transformedData = transformTaskData(taskData);
      const formData = createFormData(transformedData, taskData.attachments);
      const response = await tasksAPI.createTask(formData);

      set((state) => {
        const newTask = response.data;
        if (state.tasks.some(task => task.id === newTask.id)) {
          return state;
        }
        return { tasks: [...state.tasks, newTask] };
      });

      return response.data;
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
      throw err;
    }
  },

  // Обновление задачи
  updateTask: async (taskId, taskData) => {
    try {
      const transformedData = transformTaskData(taskData);
      const formData = createFormData(transformedData, taskData.attachments);
      const response = await tasksAPI.updateTask(taskId, formData);

      set((state) => ({
        tasks: state.tasks.map(task => {
          if (task.id === taskId) {
            return {
              ...task,
              ...response,
              status: {
                id: getStatusId(response?.status || task?.status),
                name: (response?.status || task?.status)?.name || ''
              },
              category: {
                id: getCategoryId(response?.category || task?.category),
                name: (response?.category || task?.category)?.name || ''
              },
              attachments: response?.attachments || task?.attachments || []
            };
          }
          return task;
        })
      }));

      return response;
    } catch (err) {
      console.error('Ошибка при обновлении задачи:', err);
      throw err;
    }
  },

  // Удаление задачи
  deleteTask: async (taskId) => {
    try {
      await tasksAPI.deleteTask(taskId);
      set((state) => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      }));
    } catch (err) {
      console.error('Ошибка при удалении задачи:', err);
      throw err;
    }
  },

  // Обновление статуса задачи
  updateTaskStatus: async (taskId, newStatus) => {
    try {
      const response = await tasksAPI.updateTaskStatus(taskId, newStatus);
      set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? response.data : task
        )
      }));
      return response.data;
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
      throw err;
    }
  },

  // Фильтрация задач
  filterTasks: () => {
    const { tasks, filters } = get();
    
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDescription = task.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) return false;
      }
      
      if (filters.category && task.category !== filters.category) return false;
      
      if (filters.dateRange.start || filters.dateRange.end) {
        const taskDate = new Date(task.deadline);
        if (filters.dateRange.start && taskDate < new Date(filters.dateRange.start)) return false;
        if (filters.dateRange.end && taskDate > new Date(filters.dateRange.end)) return false;
      }
      
      return true;
    });
  },

  // Сброс фильтров
  resetFilters: () => set({
    filters: {
      status: '',
      priority: '',
      search: '',
      category: '',
      dateRange: { start: '', end: '' }
    }
  })
})); 
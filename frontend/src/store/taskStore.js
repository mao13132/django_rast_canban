import { create } from 'zustand';
import { tasksAPI, categoriesAPI, statusesAPI } from '../services/api';
import LocalStorageService from '../services/localStorageService';
import * as TaskDTO from '../dto/TaskDTO';
import * as StatusDTO from '../dto/StatusDTO';

// Константы для ключей localStorage
const STORAGE_KEYS = {
  SORT_BY: 'kanban_sort_by',
  FILTERS: 'kanban_filters'
};

export const useTaskStore = create((set, get) => ({
  // Состояние
  tasks: [],
  filteredTasks: [],
  categories: [],
  statuses: [],
  loading: false,
  error: null,
  sortBy: LocalStorageService.get(STORAGE_KEYS.SORT_BY, []),
  filters: LocalStorageService.get(STORAGE_KEYS.FILTERS, {
    status: '',
    priority: '',
    search: '',
    category: '',
    dateRange: {
      start: '',
      end: ''
    }
  }),

  // Действия
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  setSortBy: (field) => {
    const currentSortBy = get().sortBy;
    const index = currentSortBy.indexOf(field);
    
    let newSortBy;
    if (index === -1) {
      // Добавляем новое поле сортировки
      newSortBy = [...currentSortBy, field];
    } else {
      // Удаляем поле из сортировки
      newSortBy = currentSortBy.filter((item, i) => i !== index);
    }

    // Сохраняем в localStorage и обновляем состояние
    LocalStorageService.set(STORAGE_KEYS.SORT_BY, newSortBy);
    set({ sortBy: newSortBy });
  },

  setFilters: (newFilters) => {
    const updatedFilters = {
      ...get().filters,
      ...newFilters,
      dateRange: {
        ...get().filters.dateRange,
        ...(newFilters.dateRange || {})
      }
    };

    // Сохраняем в localStorage и обновляем состояние
    LocalStorageService.set(STORAGE_KEYS.FILTERS, updatedFilters);
    set({ filters: updatedFilters });
  },

  // Сброс фильтров
  resetFilters: () => {
    const defaultFilters = {
      status: '',
      priority: '',
      search: '',
      category: '',
      dateRange: { start: '', end: '' }
    };

    // Очищаем в localStorage и сбрасываем состояние
    LocalStorageService.set(STORAGE_KEYS.FILTERS, defaultFilters);
    LocalStorageService.set(STORAGE_KEYS.SORT_BY, []);
    set({ 
      filters: defaultFilters,
      sortBy: []
    });
  },

  // Получение всех задач
  fetchTasks: async () => {
    try {
      set({ loading: true });
      const response = await tasksAPI.getTasks();
      const normalizedTasks = response.data.map(TaskDTO.fromBackend);
      set({ tasks: normalizedTasks, error: null });
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
      // Нормализуем и сортируем статусы
      const normalizedStatuses = response.data.map(StatusDTO.fromBackend);
      const sortedStatuses = normalizedStatuses.sort((a, b) => a.order - b.order);
      set({ statuses: sortedStatuses });
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
      const formData = TaskDTO.toBackend(taskData, taskData.attachments);
      const response = await tasksAPI.createTask(formData);
      const normalizedTask = TaskDTO.fromBackend(response.data);

      set((state) => ({
        tasks: [...state.tasks, normalizedTask]
      }));

      return normalizedTask;
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
      throw err;
    }
  },

  // Обновление задачи
  updateTask: async (taskId, taskData) => {
    try {
      const formData = TaskDTO.toBackend(taskData, taskData.attachments);
      const response = await tasksAPI.updateTask(taskId, formData);
      const normalizedTask = TaskDTO.fromBackend(response);

      set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? normalizedTask : task
        )
      }));

      return normalizedTask;
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
      const task = get().tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Задача не найдена');

      const updatedTask = {
        ...task,
        status: newStatus
      };

      return await get().updateTask(taskId, updatedTask);
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
  }
})); 
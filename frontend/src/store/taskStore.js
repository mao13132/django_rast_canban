import { create } from 'zustand';
import { tasksAPI, categoriesAPI, statusesAPI, notesAPI } from '../services/api';
import LocalStorageService from '../services/localStorageService';
import * as TaskDTO from '../dto/TaskDTO';
import * as StatusDTO from '../dto/StatusDTO';
import * as CategoryDTO from '../dto/CategoryDTO';
import * as NoteDTO from '../dto/NoteDTO';

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
  notes: [],
  loading: false,
  categoriesLoading: false,
  notesLoading: false,
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
      set({ categoriesLoading: true });
      const response = await categoriesAPI.getCategories();
      set({ categories: response.data });
    } catch (err) {
      console.error('Ошибка при загрузке категорий:', err);
      set({ categories: [] });
    } finally {
      set({ categoriesLoading: false });
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
  },

  // Создание категории
  createCategory: async (formData) => {
    try {
      set({ categoriesLoading: true });
      const categoryData = CategoryDTO.toBackend(formData);
      const response = await categoriesAPI.createCategory(categoryData);
      const normalizedCategory = CategoryDTO.fromBackend(response.data);
      
      // Обновляем список категорий
      await get().fetchCategories();
      
      return normalizedCategory;
    } catch (err) {
      console.error('Ошибка при создании категории:', err);
      throw err;
    } finally {
      set({ categoriesLoading: false });
    }
  },

  // Обновление категории
  updateCategory: async (categoryId, formData) => {
    try {
      set({ categoriesLoading: true });
      const categoryData = CategoryDTO.toBackend(formData);
      const response = await categoriesAPI.updateCategory(categoryId, categoryData);
      const normalizedCategory = CategoryDTO.fromBackend(response.data);
      
      // Обновляем список категорий
      await get().fetchCategories();
      
      return normalizedCategory;
    } catch (err) {
      console.error('Ошибка при обновлении категории:', err);
      throw err;
    } finally {
      set({ categoriesLoading: false });
    }
  },

  // Удаление категории
  deleteCategory: async (categoryId) => {
    try {
      set({ categoriesLoading: true });
      await categoriesAPI.deleteCategory(categoryId);
      
      // Обновляем список категорий
      await get().fetchCategories();
    } catch (err) {
      console.error('Ошибка при удалении категории:', err);
      throw err;
    } finally {
      set({ categoriesLoading: false });
    }
  },

  // Получение заметок
  fetchNotes: async () => {
    try {
      set({ notesLoading: true });
      const response = await notesAPI.getNotes();
      const normalizedNotes = response.data.map(NoteDTO.fromBackend);
      
      // Сортируем заметки: сначала закрепленные, потом по алфавиту
      const sortedNotes = normalizedNotes.sort((a, b) => {
        // Сначала сравниваем по закреплению
        if (a.is_pinned !== b.is_pinned) {
          return b.is_pinned ? 1 : -1;
        }
        // Если закрепление одинаковое, сортируем по алфавиту
        return a.title.localeCompare(b.title);
      });
      
      set({ notes: sortedNotes });
    } catch (err) {
      console.error('Ошибка при загрузке заметок:', err);
      set({ notes: [] });
    } finally {
      set({ notesLoading: false });
    }
  },

  // Создание заметки
  createNote: async (formData) => {
    try {
      set({ notesLoading: true });
      const noteData = NoteDTO.toBackend(formData);
      const response = await notesAPI.createNote(noteData);
      const newNote = NoteDTO.fromBackend(response.data);
      
      set((state) => ({
        notes: [...state.notes, newNote]
      }));

      return newNote;
    } catch (err) {
      console.error('Ошибка при создании заметки:', err);
      throw err;
    } finally {
      set({ notesLoading: false });
    }
  },

  // Обновление заметки
  updateNote: async (noteId, formData) => {
    try {
      set({ notesLoading: true });
      const noteData = NoteDTO.toBackend(formData);
      const response = await notesAPI.updateNote(noteId, noteData);
      const updatedNote = NoteDTO.fromBackend(response.data);
      
      set((state) => ({
        notes: state.notes.map(note => 
          note.id === noteId ? updatedNote : note
        )
      }));

      return updatedNote;
    } catch (err) {
      console.error('Ошибка при обновлении заметки:', err);
      throw err;
    } finally {
      set({ notesLoading: false });
    }
  },

  // Удаление заметки
  deleteNote: async (noteId) => {
    try {
      set({ notesLoading: true });
      await notesAPI.deleteNote(noteId);
      
      set((state) => ({
        notes: state.notes.filter(note => note.id !== noteId)
      }));
    } catch (err) {
      console.error('Ошибка при удалении заметки:', err);
      throw err;
    } finally {
      set({ notesLoading: false });
    }
  },

  // Получение заметки по ID
  getNote: async (noteId) => {
    try {
      set({ notesLoading: true });
      const response = await notesAPI.getNote(noteId);
      const note = NoteDTO.fromBackend(response.data);
      return note;
    } catch (err) {
      console.error('Ошибка при получении заметки:', err);
      throw err;
    } finally {
      set({ notesLoading: false });
    }
  },
})); 
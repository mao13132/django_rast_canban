import React, { createContext, useContext, useState, useCallback } from 'react';
import { tasksAPI } from '../services/api';

// Создаем контекст фильтрации
export const TaskFilterContext = createContext(null);

// Хук для использования контекста фильтрации
export const useTaskFilter = () => useContext(TaskFilterContext);

// Провайдер контекста фильтрации
export const TaskFilterProvider = ({ children }) => {
  // Состояние фильтров
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    category: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Обновление фильтров
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    setFilters({
      status: '',
      priority: '',
      search: '',
      category: '',
      dateRange: {
        start: '',
        end: ''
      }
    });
  }, []);

  // Получение отфильтрованных задач с сервера
  const fetchFilteredTasks = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = {
        ...(filters.status && { status: filters.status }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.dateRange.start && { start_date: filters.dateRange.start }),
        ...(filters.dateRange.end && { end_date: filters.dateRange.end })
      };

      const response = await tasksAPI.getFilteredTasks(params);
      setFilteredTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка при получении отфильтрованных задач');
      console.error('Ошибка при получении отфильтрованных задач:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Локальная фильтрация задач (если нужно)
  const filterTasks = useCallback((tasks) => {
    return tasks.filter(task => {
      // Фильтрация по статусу
      if (filters.status && task.status !== filters.status) {
        return false;
      }

      // Фильтрация по приоритету
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // Фильтрация по поисковой строке
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(searchLower);
        const matchesDescription = task.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) {
          return false;
        }
      }

      // Фильтрация по категории
      if (filters.category && task.category !== filters.category) {
        return false;
      }

      // Фильтрация по диапазону дат
      if (filters.dateRange.start || filters.dateRange.end) {
        const taskDate = new Date(task.deadline);
        
        if (filters.dateRange.start) {
          const startDate = new Date(filters.dateRange.start);
          if (taskDate < startDate) {
            return false;
          }
        }
        
        if (filters.dateRange.end) {
          const endDate = new Date(filters.dateRange.end);
          if (taskDate > endDate) {
            return false;
          }
        }
      }

      return true;
    });
  }, [filters]);

  const value = {
    filters,
    loading,
    error,
    filteredTasks,
    updateFilters,
    resetFilters,
    fetchFilteredTasks,
    filterTasks
  };

  return (
    <TaskFilterContext.Provider value={value}>
      {children}
    </TaskFilterContext.Provider>
  );
}; 
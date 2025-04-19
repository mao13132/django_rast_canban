import React, { createContext, useContext, useState } from 'react';

// Создаем контекст фильтрации
export const TaskFilterContext = createContext(null);

// Хук для использования контекста фильтрации
export const useTaskFilter = () => useContext(TaskFilterContext);

// Провайдер контекста фильтрации
export const TaskFilterProvider = ({ children }) => {
  // Состояние фильтров
  const [filters, setFilters] = useState({
    status: null,      // Статус задачи
    priority: null,    // Приоритет
    search: '',        // Поисковая строка
    category: null,    // Категория
    dateRange: null,   // Диапазон дат
  });

  // Функция для обновления фильтров
  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // Функция для сброса всех фильтров
  const resetFilters = () => {
    setFilters({
      status: null,
      priority: null,
      search: '',
      category: null,
      dateRange: null,
    });
  };

  // Функция для фильтрации списка задач
  const filterTasks = (tasks) => {
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
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Фильтрация по категории
      if (filters.category && task.category !== filters.category) {
        return false;
      }

      // Фильтрация по диапазону дат
      if (filters.dateRange) {
        const taskDate = new Date(task.deadline);
        if (taskDate < filters.dateRange.start || taskDate > filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  };

  const value = {
    filters,
    updateFilters,
    resetFilters,
    filterTasks
  };

  return (
    <TaskFilterContext.Provider value={value}>
      {children}
    </TaskFilterContext.Provider>
  );
}; 
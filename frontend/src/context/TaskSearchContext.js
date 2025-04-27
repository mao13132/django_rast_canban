import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';

// Создаем контекст для поиска задач
export const TaskSearchContext = createContext(null);

// Хук для использования контекста в компонентах
export const useTaskSearch = () => useContext(TaskSearchContext);

// Провайдер контекста поиска задач
export const TaskSearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { setFilters } = useTaskStore();

  // Дебаунс для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setFilters({ search: searchQuery });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, setFilters]);

  // Функция для фильтрации задач
  const filterTasks = (tasks) => {
    return tasks.filter(task => {
      if (!task || !task.status) return false;

      // Фильтрация по поисковому запросу
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const matchesSearch =
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      return true;
    });
  };

  const value = {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    filterTasks
  };

  return <TaskSearchContext.Provider value={value}>{children}</TaskSearchContext.Provider>;
}; 
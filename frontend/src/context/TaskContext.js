import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../services/api';

// Создаем контекст для задач
export const TaskContext = createContext(null);

// Хук для использования контекста задач
export const useTask = () => useContext(TaskContext);

// Провайдер контекста задач
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Получение всех задач
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tasks/');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке задач');
      console.error('Ошибка при загрузке задач:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Создание новой задачи
  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      const response = await api.post('/api/tasks/', taskData);
      setTasks(prev => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError('Ошибка при создании задачи');
      console.error('Ошибка при создании задачи:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновление задачи
  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      setLoading(true);
      const response = await api.put(`/api/tasks/${taskId}/`, taskData);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? response.data : task
      ));
      setError(null);
      return response.data;
    } catch (err) {
      setError('Ошибка при обновлении задачи');
      console.error('Ошибка при обновлении задачи:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Удаление задачи
  const deleteTask = useCallback(async (taskId) => {
    try {
      setLoading(true);
      await api.delete(`/api/tasks/${taskId}/`);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setError(null);
    } catch (err) {
      setError('Ошибка при удалении задачи');
      console.error('Ошибка при удалении задачи:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Изменение статуса задачи
  const updateTaskStatus = useCallback(async (taskId, newStatus) => {
    try {
      setLoading(true);
      const response = await api.patch(`/api/tasks/${taskId}/`, { status: newStatus });
      setTasks(prev => prev.map(task => 
        task.id === taskId ? response.data : task
      ));
      setError(null);
      return response.data;
    } catch (err) {
      setError('Ошибка при обновлении статуса задачи');
      console.error('Ошибка при обновлении статуса задачи:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}; 
import React, { createContext, useContext, useState, useCallback } from 'react';
import { tasksAPI, categoriesAPI, statusesAPI, attachmentsAPI } from '../services/api';

// Создаем контекст для задач
export const TaskContext = createContext(null);

// Хук для использования контекста задач
export const useTask = () => useContext(TaskContext);

// Вспомогательная функция для преобразования данных задачи
const transformTaskData = (taskData) => {
  return {
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority,
    category_id: taskData.category?.id || taskData.category,
    status_id: taskData.status?.id || taskData.status,
    deadline_start: taskData.deadline?.start,
    deadline_end: taskData.deadline?.end
  };
};

// Вспомогательная функция для создания FormData
const createFormData = (data, files = []) => {
  const formData = new FormData();
  
  // Добавляем все поля в FormData
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  
  // Добавляем файлы
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('attachments', file);
    });
  }
  
  return formData;
};

// Провайдер контекста задач
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Получение всех задач
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getTasks();
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке задач');
      console.error('Ошибка при загрузке задач:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение категорий
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке категорий:', err);
    }
  }, []);

  // Получение статусов
  const fetchStatuses = useCallback(async () => {
    try {
      const response = await statusesAPI.getStatuses();
      setStatuses(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке статусов:', err);
    }
  }, []);

  // Создание новой задачи
  const createTask = useCallback(async (taskData) => {
    try {
      setLoading(true);
      
      // Преобразуем данные задачи
      const transformedData = transformTaskData(taskData);
      
      // Создаем FormData
      const formData = createFormData(transformedData, taskData.attachments);

      const response = await tasksAPI.createTask(formData);
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
      
      // Преобразуем данные задачи
      const transformedData = transformTaskData(taskData);
      
      // Создаем FormData
      const formData = createFormData(transformedData, taskData.attachments);

      const response = await tasksAPI.updateTask(taskId, formData);
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
      await tasksAPI.deleteTask(taskId);
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
      const response = await tasksAPI.updateTaskStatus(taskId, newStatus);
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

  // Добавление вложения
  const addTaskAttachment = useCallback(async (taskId, file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('task', taskId);

      const response = await attachmentsAPI.createAttachment(formData);
      
      // Обновляем задачу с новым вложением
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, attachments: [...task.attachments, response.data] }
          : task
      ));
      
      return response.data;
    } catch (err) {
      setError('Ошибка при добавлении вложения');
      console.error('Ошибка при добавлении вложения:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Удаление вложения
  const deleteTaskAttachment = useCallback(async (taskId, attachmentId) => {
    try {
      setLoading(true);
      await attachmentsAPI.deleteAttachment(attachmentId);
      
      // Обновляем задачу, удаляя вложение
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              attachments: task.attachments.filter(att => att.id !== attachmentId)
            }
          : task
      ));
    } catch (err) {
      setError('Ошибка при удалении вложения');
      console.error('Ошибка при удалении вложения:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    tasks,
    categories,
    statuses,
    loading,
    error,
    fetchTasks,
    fetchCategories,
    fetchStatuses,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    addTaskAttachment,
    deleteTaskAttachment
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}; 
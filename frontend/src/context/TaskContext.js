import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { tasksAPI, categoriesAPI, statusesAPI, attachmentsAPI } from '../services/api';

// Создаем контекст для задач
export const TaskContext = createContext(null);

// Хук для использования контекста задач
export const useTask = () => useContext(TaskContext);

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
      console.error('Ошибка при загрузке задач:', err);
      setError('Ошибка при загрузке задач');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение категорий
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке категорий:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Получение статусов
  const fetchStatuses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await statusesAPI.getStatuses();
      setStatuses(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке статусов:', err);
      setStatuses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Создание новой задачи
  const createTask = useCallback(async (taskData) => {
    try {
      // Преобразуем данные задачи
      const transformedData = transformTaskData(taskData);

      // Создаем FormData
      const formData = createFormData(transformedData, taskData.attachments);

      const response = await tasksAPI.createTask(formData);

      // Оптимизированное обновление состояния
      setTasks(prevTasks => {
        const newTask = response.data;
        // Проверяем, что задача с таким ID еще не существует
        if (prevTasks.some(task => task.id === newTask.id)) {
          return prevTasks;
        }
        return [...prevTasks, newTask];
      });

      return response.data;
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
      throw err;
    }
  }, []);

  // Обновление задачи
  const updateTask = useCallback(async (taskId, taskData) => {
    try {

      const transformedData = transformTaskData(taskData);

      const formData = createFormData(transformedData, taskData.attachments);

      const response = await tasksAPI.updateTask(taskId, formData);

      // Получаем обновленные данные из ответа
      const updatedTask = response;

      // Обновляем локальное состояние, сохраняя существующие данные
      setTasks(prevTasks => {
        const newTasks = prevTasks.map(task => {
          if (task && task.id === taskId) {
            const updatedTaskData = {
              ...task,  // Сохраняем существующие данные
              ...updatedTask,  // Добавляем обновленные данные
              status: {
                id: getStatusId(updatedTask?.status || task?.status),
                name: (updatedTask?.status || task?.status)?.name || ''
              },
              category: {
                id: getCategoryId(updatedTask?.category || task?.category),
                name: (updatedTask?.category || task?.category)?.name || ''
              },
              attachments: updatedTask?.attachments || task?.attachments || []
            };
            return updatedTaskData;
          }
          return task;
        });
        return newTasks;
      });

      // Добавляем проверку после обновления состояния

      return updatedTask;
    } catch (err) {
      console.error('Ошибка при обновлении задачи:', err);
      throw err;
    }
  }, []);

  // Удаление задачи
  const deleteTask = useCallback(async (taskId) => {
    try {
      await tasksAPI.deleteTask(taskId);

      // Оптимизированное обновление состояния
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Ошибка при удалении задачи:', err);
      throw err;
    }
  }, []);

  // Изменение статуса задачи
  const updateTaskStatus = useCallback(async (taskId, newStatus) => {
    try {
      const response = await tasksAPI.updateTaskStatus(taskId, newStatus);

      // Оптимизированное обновление состояния
      setTasks(prevTasks =>
        prevTasks.map(task => task.id === taskId ? response.data : task)
      );

      return response.data;
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
      throw err;
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

  // Мемоизированные значения для оптимизации
  const value = useMemo(() => ({
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
  }), [tasks, categories, statuses, loading, error, fetchTasks, fetchCategories, fetchStatuses, createTask, updateTask, deleteTask, updateTaskStatus]);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}; 
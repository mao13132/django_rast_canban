import React, { createContext, useState, useContext } from 'react';

// Создаем контекст для формы редактирования задачи
export const EditTaskFormContext = createContext(null);

// Хук для использования контекста в компонентах
export const useEditTaskForm = () => useContext(EditTaskFormContext);

// Провайдер контекста формы редактирования задачи
export const EditTaskFormProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Открыть форму редактирования задачи
  const openEditForm = (task) => {
    setTaskData(task);
    setIsOpen(true);
  };

  // Закрыть форму
  const closeForm = () => {
    setIsOpen(false);
    setTimeout(() => {
      setTaskData(null);
      setError(null);
    }, 300);
  };

  // Обновить данные задачи
  const updateTaskData = (newData) => {
    setTaskData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const value = {
    isOpen,
    taskData,
    loading,
    error,
    openEditForm,
    closeForm,
    updateTaskData,
    setLoading,
    setError
  };

  return <EditTaskFormContext.Provider value={value}>{children}</EditTaskFormContext.Provider>;
}; 
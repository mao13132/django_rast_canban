import React, { createContext, useState, useContext } from 'react';

// Создаем контекст для формы задач
export const TaskFormContext = createContext(null);

// Хук для использования контекста в компонентах
export const useTaskForm = () => useContext(TaskFormContext);

// Провайдер контекста формы задач
export const TaskFormProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [mode, setMode] = useState('create'); // 'create' или 'edit'

  // Открыть форму создания новой задачи
  const openCreateForm = () => {
    setMode('create');
    setInitialData(null);
    setIsOpen(true);
  };

  // Открыть форму редактирования задачи
  const openEditForm = (taskData) => {
    setMode('edit');
    setInitialData(taskData);
    setIsOpen(true);
  };

  // Закрыть форму
  const closeForm = () => {
    setIsOpen(false);
    setTimeout(() => {
      setInitialData(null);
      setMode('create');
    }, 300);
  };

  const value = {
    isOpen,
    initialData,
    mode,
    openCreateForm,
    openEditForm,
    closeForm
  };

  return <TaskFormContext.Provider value={value}>{children}</TaskFormContext.Provider>;
}; 
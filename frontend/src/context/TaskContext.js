import React, { createContext, useState, useContext } from 'react';
import { tasksAPI } from '../services/api';

// Функция для преобразования данных задачи
const transformTaskData = (taskData) => {
  return {
    ...taskData,
    status_id: taskData.status,
    category_id: taskData.category
  };
};

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const updateTask = async (taskId, taskData) => {
    try {
      const transformedData = transformTaskData(taskData);
      const formData = new FormData();
      
      Object.entries(transformedData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await tasksAPI.updateTask(taskId, formData);

      if (response) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId ? response : task
          )
        );
        return response;
      } else {
        throw new Error('No response data received');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}; 
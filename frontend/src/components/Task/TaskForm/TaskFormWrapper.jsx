import React from 'react';
import { NotificationProvider } from '../../../context/NotificationContext';
import TaskForm from './TaskForm';

const TaskFormWrapper = () => {
  return (
    <NotificationProvider>
      <TaskForm />
    </NotificationProvider>
  );
};

export default TaskFormWrapper; 
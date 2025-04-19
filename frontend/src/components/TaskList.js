import React from 'react';
import { useTask } from '../context/TaskContext';
import TaskItem from './TaskItem';

const TaskList = () => {
  const { tasks, loading, error } = useTask();

  if (loading) {
    return <div className="text-center">Загрузка задач...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Ошибка: {error}</div>;
  }

  if (!tasks.length) {
    return <div className="text-center">Нет задач</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList; 
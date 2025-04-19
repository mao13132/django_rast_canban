import React from 'react';
import { useTask } from '../context/TaskContext';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const TaskItem = ({ task }) => {
  const { updateTask, deleteTask } = useTask();

  const handleStatusChange = (e) => {
    updateTask(task.id, { status: e.target.value });
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      deleteTask(task.id);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>
      
      <p className="text-gray-600 mb-3">{task.description}</p>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Статус:</span>
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="border rounded px-2 py-1"
          >
            <option value="todo">К выполнению</option>
            <option value="in_progress">В процессе</option>
            <option value="done">Выполнено</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-500">
          Срок: {format(new Date(task.due_date), 'dd MMMM yyyy', { locale: ru })}
        </div>
        
        {task.category && (
          <div className="text-sm">
            <span className="text-gray-500">Категория:</span>{' '}
            <span className="text-blue-500">{task.category.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem; 
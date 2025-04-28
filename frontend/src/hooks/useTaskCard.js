import { useTaskStore } from '../store/taskStore';
import { useEditTaskForm } from '../context/EditTaskFormContext';
import { getPriorityIcon } from '../utils/PriorityIcons';

export const useTaskCard = (task) => {
  const { updateTask, deleteTask } = useTaskStore();
  const { openEditForm } = useEditTaskForm();

  const handleStatusChange = (e) => {
    updateTask(task.id, { status: e.target.value });
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      deleteTask(task.id);
    } 
  };

  const handleEdit = () => {
    openEditForm(task);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '__';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}`;
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'block':
        return 'Блокер';
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return priority;
    }
  };

  return {
    handleStatusChange,
    handleDelete,
    handleEdit,
    getPriorityIcon,
    formatDate,
    getPriorityText
  };
}; 
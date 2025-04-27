import { useTaskStore } from '../store/taskStore';
import { useTaskForm } from '../context/TaskFormContext';

export const useTaskCard = (task) => {
  const { updateTask, deleteTask } = useTaskStore();
  const { openEditForm } = useTaskForm();

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

  const getPriorityIcon = (priority, className) => {
    switch (priority) {
      case 'block':
        return <img className={className} src="/assets/block.png" alt="Блокер" />;
      case 'high':
        return (
          <svg className={className} width="12" height="76" viewBox="0 0 10 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.588 0.799998H9.19L7.718 22.374H2.106L0.588 0.799998ZM0.588 30.148C0.588 28.9827 0.986667 28.032 1.784 27.296C2.612 26.56 3.65467 26.192 4.912 26.192C6.16933 26.192 7.19667 26.56 7.994 27.296C8.822 28.032 9.236 28.9827 9.236 30.148C9.236 31.3133 8.822 32.264 7.994 33C7.19667 33.736 6.16933 34.104 4.912 34.104C3.65467 34.104 2.612 33.736 1.784 33C0.986667 32.264 0.588 31.3133 0.588 30.148Z" fill="#E93C25"/>
          </svg>
        );
      case 'medium':
        return (
          <svg className={className} width="12" height="76" viewBox="0 0 10 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.588 0.799998H9.19L7.718 22.374H2.106L0.588 0.799998ZM0.588 30.148C0.588 28.9827 0.986667 28.032 1.784 27.296C2.612 26.56 3.65467 26.192 4.912 26.192C6.16933 26.192 7.19667 26.56 7.994 27.296C8.822 28.032 9.236 28.9827 9.236 30.148C9.236 31.3133 8.822 32.264 7.994 33C7.19667 33.736 6.16933 34.104 4.912 34.104C3.65467 34.104 2.612 33.736 1.784 33C0.986667 32.264 0.588 31.3133 0.588 30.148Z" fill="#0066FF"/>
          </svg>
        );
      case 'low':
        return (
          <svg className={className} width="12" height="76" viewBox="0 0 10 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.588 0.799998H9.19L7.718 22.374H2.106L0.588 0.799998ZM0.588 30.148C0.588 28.9827 0.986667 28.032 1.784 27.296C2.612 26.56 3.65467 26.192 4.912 26.192C6.16933 26.192 7.19667 26.56 7.994 27.296C8.822 28.032 9.236 28.9827 9.236 30.148C9.236 31.3133 8.822 32.264 7.994 33C7.19667 33.736 6.16933 34.104 4.912 34.104C3.65467 34.104 2.612 33.736 1.784 33C0.986667 32.264 0.588 31.3133 0.588 30.148Z" fill="#6AC618"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
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
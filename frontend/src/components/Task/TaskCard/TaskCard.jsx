import React from 'react';
import { useTaskStore } from '../../../store/taskStore';
import { useTaskForm } from '../../../context/TaskFormContext';
import styles from './TaskCard.module.css';

const TaskCard = ({ task }) => {
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return styles.highPriority;
      case 'medium':
        return styles.mediumPriority;
      case 'low':
        return styles.lowPriority;
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  const getPriorityText = (priority) => {
    switch (priority) {
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

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>{task.title}</h3>
          <div className={styles.actions}>
            <button onClick={handleEdit} className={styles.editButton}>✎</button>
            <button onClick={handleDelete} className={styles.deleteButton}>✕</button>
          </div>
        </div>
        <p className={styles.description}>{task.description}</p>
      </div>

      <div className={styles.details}>
        <div className={styles.priority}>
          <span className={`${styles.priorityIndicator} ${getPriorityColor(task.priority)}`} />
          <span>Приоритет: {getPriorityText(task.priority)}</span>
        </div>

        <div className={styles.category}>
          <span className={styles.categoryIcon}>📁</span>
          <span>{task.category?.name || 'Без категории'}</span>
        </div>

        {task.deadline && (
          <div className={styles.deadline}>
            <span className={styles.deadlineIcon}>🕒</span>
            <span>с {formatDate(task.deadline.start)} по {formatDate(task.deadline.end)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard; 
import React from 'react';
import styles from './TaskCard.module.css';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const handleStatusChange = (e) => {
    onUpdate(task.id, { status: e.target.value });
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      onDelete(task.id);
    }
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

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>{task.title}</h3>
          <button onClick={handleDelete} className={styles.deleteButton}>✕</button>
        </div>
        <p className={styles.description}>{task.description}</p>
      </div>

      <div className={styles.details}>
        <div className={styles.priority}>
          <span className={`${styles.priorityIndicator} ${getPriorityColor(task.priority)}`} />
          <span>Приоритет: {task.priority}</span>
        </div>

        <div className={styles.category}>
          <span className={styles.categoryIcon}>📁</span>
          <span>{task.category || 'Без категории'}</span>
        </div>

        {task.due_date && (
          <div className={styles.deadline}>
            <span className={styles.deadlineIcon}>🕒</span>
            <span>{formatDate(task.due_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard; 
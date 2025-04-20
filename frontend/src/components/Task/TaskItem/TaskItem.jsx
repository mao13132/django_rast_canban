import React from 'react';
import { useTaskForm } from '../../../context/TaskFormContext';
import styles from './TaskItem.module.css';

const TaskItem = ({ task, onUpdate, onDelete, onUpdateStatus }) => {
  const { openEditForm } = useTaskForm();

  const handleEdit = () => {
    openEditForm(task);
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className={styles.taskItem}>
      <div className={styles.taskHeader}>
        <h4 className={styles.taskTitle}>{task.title}</h4>
        <div className={styles.taskActions}>
          <button onClick={handleEdit} className={styles.editButton}>✎</button>
          <button onClick={handleDelete} className={styles.deleteButton}>×</button>
        </div>
      </div>
      
      {task.description && (
        <p className={styles.taskDescription}>{task.description}</p>
      )}
      
      <div className={styles.taskFooter}>
        <span className={`${styles.priority} ${styles[task.priority]}`}>
          {task.priority}
        </span>
        {task.deadline && (
          <span className={styles.deadline}>
            {new Date(task.deadline).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskItem; 
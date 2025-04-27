import React from 'react';
import styles from './TaskCard.module.css';
import { useTaskCard } from '../../../hooks/useTaskCard';

const TaskCard = ({ task }) => {
  const {
    handleDelete,
    handleEdit,
    getPriorityIcon,
    formatDate,
    getPriorityText
  } = useTaskCard(task);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.iconTitleWrapper}>
            <div className={styles.iconWrapper}>
              <img className={styles.iconTitle} src="/assets/name.png" alt="Название задачи" />
            </div>
            <span className={styles.titleText}>{task.title}</span>
          </div>
          <div className={styles.actions}>
            <button onClick={handleEdit} className={styles.editButton}>✎</button>
          </div>
        </div>

        <div className={styles.descriptionWrapper}>
          <div className={styles.descriptionIconWrapper}>
            <img className={styles.descriptionIcon} src="/assets/desc.png" alt="Описание задачи" />
          </div>
          <p className={styles.description}>{task.description}</p>
        </div>

      </div>

      <div className={styles.details}>
        <div className={styles.priority}>
          <div className={styles.priorityIconWrapper}>
            {getPriorityIcon(task.priority, styles.priorityIcon)}
          </div>
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
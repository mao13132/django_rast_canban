import React from 'react';
import styles from './TaskCard.module.css';
import { useTaskCard } from '../../../hooks/useTaskCard';
import { getPriorityIcon } from '../../../utils/PriorityIcons';

const TaskCard = ({ task }) => {
  const {
    handleEdit,
    formatDate,
    getPriorityText
  } = useTaskCard(task);

  // Определяем, является ли задача срочной (осталось 1 день или меньше)
  const isUrgent = task.days_remaining !== null && task.days_remaining <= 1;

  return (
    <div className={`${styles.card} ${isUrgent ? styles.urgent : ''}`}>
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
          <div className={styles.descTitle}>
            <div className={styles.descriptionIconWrapper}>
              <img className={styles.descriptionIcon} src="/assets/desc.png" alt="Описание задачи" />
            </div>
            <p className={styles.description}>Описание задачи</p>
          </div>

          <div className={styles.descriptionContainer}>

            <textarea readOnly value={task.description} editable={false} className={styles.descriptionTextarea}></textarea>

          </div>

        </div>

      </div>

      <div className={styles.priorityWrapper}>

        <div className={styles.priority}>
          <div className={styles.priorityIconWrapper}>
            <img className={styles.iconTitle} src="/assets/prior.png" alt="Приоритет" />
          </div>
          <span>Приоритет</span>
        </div>


        <div className={styles.priority}>
          <div className={styles.priorityIconWrapper}>
            {getPriorityIcon(task.priority, styles.priorityIcon)}
          </div>
          <span>{getPriorityText(task.priority)}</span>
        </div>

      </div>

      <div className={styles.categoryWrapper}>
        <div className={styles.categoryIconWrapper}>
          <img className={styles.iconCategory} src="/assets/category.png" alt="Категория" />
        </div>

        <div className={styles.category}>
          {task.category?.name || 'Без категории'}
        </div>

      </div>

      {task.deadline && (
        <div className={styles.deadline}>
          <div className={styles.deadlineIconWrapper}>
            {isUrgent ? <img className={styles.descriptionIcon} src="/assets/dedline.png" alt="Дедлайн" /> : <img className={styles.descriptionIcon} src="/assets/date.png" alt="Дедлайн" />}
          </div>
          <span>с <span className={styles.date}>{formatDate(task.deadline.start)}</span> по <span className={styles.date}>{formatDate(task.deadline.end)}</span></span>
        </div>
      )}
    </div>
  );
};

export default TaskCard; 
import React from 'react';
import TaskItem from '../TaskItem';
import styles from './TaskColumn.module.css';

const TaskColumn = ({ title, tasks, onUpdateTask, onDeleteTask, onUpdateStatus }) => {
  return (
    <div className={styles.column}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.tasks}>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn; 
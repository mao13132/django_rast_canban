import React, { memo } from 'react';
import TaskItem from '../TaskItem';
import styles from './TaskColumn.module.css';

const TaskColumn = memo(({ title, color, tasks, onUpdateTask, onDeleteTask, onUpdateStatus }) => {
  return (
    <div className={styles.column}>

      <div className={styles.badge} >
        <div className={styles.color} style={{ backgroundColor: color }}></div>
        <div className={styles.badgeLine} style={{ backgroundColor: color }}></div>

        <h3 className={styles.columnTitle}>{title}</h3>
        <div className={styles.taskCount}>{tasks.length} {tasks.length === 1 ? 'задача' : 'задач'}</div>

      </div>


      <div className={styles.tasksList}>
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
});

TaskColumn.displayName = 'TaskColumn';

export default TaskColumn; 
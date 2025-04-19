import React from 'react';
import TaskCard from '../TaskCard';
import TaskForm from '../TaskForm';
import styles from './TaskColumn.module.css';

const TaskColumn = ({
  title,
  tasks,
  onUpdateTask,
  onDeleteTask,
  showForm,
  onCreateTask,
  onCancelCreate
}) => {
  return (
    <div className={styles.column}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <span className={styles.counter}>{tasks.length} задач</span>
      </div>
      
      <div className={styles.taskList}>
        {showForm && (
          <TaskForm
            onSubmit={onCreateTask}
            onCancel={onCancelCreate}
          />
        )}
        
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn; 
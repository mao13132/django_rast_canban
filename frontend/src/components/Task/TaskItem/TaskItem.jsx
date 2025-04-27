import React from 'react';
import TaskCard from '../TaskCard';
import styles from './TaskItem.module.css';
import { useTaskStore } from '../../../store/taskStore';

const TaskItem = ({ task }) => {
  const { updateTask, deleteTask, updateTaskStatus } = useTaskStore();

  return (
    <div className={styles.taskItem}> 
      <TaskCard
        task={task}
        onUpdate={updateTask}
        onDelete={deleteTask}
        onUpdateStatus={updateTaskStatus}
      />
    </div>
  );
};

export default TaskItem; 
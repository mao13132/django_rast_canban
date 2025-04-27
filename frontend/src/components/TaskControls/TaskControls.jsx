import React from 'react';
import { useTaskForm } from '../../context/TaskFormContext';
import { useFilter } from '../../context/FilterContext';
import Filter from '../Filter/Filter';
import styles from './TaskControls.module.css';

/**
 * Компонент для управления задачами (создание и фильтрация)
 * @param {Object} props - Свойства компонента
 */
const TaskControls = () => {
  const { toggleForm } = useTaskForm();
  const { toggleFilter } = useFilter();

  return (
    <div className={styles.controls}>
      <button
        className={styles.createButton}
        onClick={toggleForm}
      >
        Создать
      </button>
      <div className={styles.menuContainer}>
        <button
          className={styles.menuButton}
          onClick={toggleFilter}
        >
          ☰
        </button>
        <Filter />
      </div>
    </div>
  );
};

export default TaskControls; 
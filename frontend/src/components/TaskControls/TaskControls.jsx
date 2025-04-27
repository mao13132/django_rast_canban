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
        
        <div className={styles.imageContainer}>
          <img src="/assets/sort.png" alt="Логотип" className={styles.sortImage} onClick={toggleFilter} />
        </div>

        <Filter />
      </div>
    </div>
  );
};

export default TaskControls; 
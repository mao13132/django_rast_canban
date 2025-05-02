import React from 'react';
import { useTaskForm } from '../../context/TaskFormContext';
import { useFilter } from '../../context/FilterContext';
import Filter from '../Filter/Filter';
import styles from './FileControls.module.css';

/**
 * Компонент для управления файлами
 * @param {Object} props - Свойства компонента
 */
const FileControls = () => {

  return (
    <div className={styles.controls}>
      <button
        className={styles.createButton}
      >
        Создать
      </button>

    </div>
  );
};

export default FileControls; 
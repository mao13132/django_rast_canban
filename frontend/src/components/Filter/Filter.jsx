import React from 'react';
import { useFilter } from '../../context/FilterContext';
import { useTaskStore } from '../../store/taskStore';
import styles from './Filter.module.css';

/**
 * Компонент сортировки задач
 * @returns {JSX.Element|null} Возвращает компонент сортировки или null, если меню закрыто
 */
const Filter = () => {
  const { isFilterOpen, closeFilter } = useFilter();
  const { sortBy, setSortBy } = useTaskStore();

  const handleSortChange = (field) => {
    setSortBy(field);
  };

  const isOptionActive = (optionId) => {
    return sortBy.includes(optionId);
  };

  if (!isFilterOpen) return null;

  const sortOptions = [
    { id: 'status', label: 'Статусу' },
    { id: 'name', label: 'Названию' },
    { id: 'priority', label: 'Приоритету' }
  ];

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <span>Строить колонки по:</span>
        <button onClick={closeFilter} className={styles.closeButton}>×</button>
      </div>
      <div className={styles.filterContent}>
        {sortOptions.map(option => (
          <div
            key={option.id}
            className={`${styles.filterOption} ${isOptionActive(option.id) ? styles.active : ''}`}
            onClick={() => handleSortChange(option.id)}
          >

            {option.label}
            <span className={styles.checkmark}></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter; 
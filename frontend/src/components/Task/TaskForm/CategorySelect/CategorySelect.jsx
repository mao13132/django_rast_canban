import React, { useState, useRef, useEffect } from 'react';
import { fromBackend } from '../../../../dto/CategoryDTO';
import styles from './CategorySelect.module.css';

const CategorySelect = ({ value, onChange, categories, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (categoryId) => {
    onChange({ target: { name: 'category', value: categoryId } });
    setIsOpen(false);
  };

  const normalizedCategories = categories.map(fromBackend);
  const selectedCategory = normalizedCategories.find(cat => cat.id === value) || { name: 'Без категории' };

  return (
    <div className={`${styles.categorySelect} ${className}`} ref={selectRef}>
      <div 
        className={styles.categorySelectHeader} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.categoryOption}>
          <span>{selectedCategory.name}</span>
        </div>
        <div className={styles.selectArrow}>
          <img src="/assets/arrow.png" alt="▼" className={styles.arrowIcon} />
        </div>
      </div>
      
      {isOpen && (
        <div className={styles.categoryOptions}>
          <div
            className={`${styles.categoryOption} ${!value ? styles.selected : ''}`}
            onClick={() => handleSelect('')}
          >
            <img src="/assets/category.png" alt="Без категории" className={styles.categoryIcon} />
            <span>Без категории</span>
          </div>
          
          {normalizedCategories.map(category => (
            <div
              key={category.id}
              className={`${styles.categoryOption} ${category.id === value ? styles.selected : ''}`}
              onClick={() => handleSelect(category.id)}
            >
              <span>{category.name}</span>
            </div>
          ))}
          
          <div
            className={styles.createCategory}
            onClick={() => {
              // Здесь будет логика создания новой категории
              setIsOpen(false);
            }}
          >
            <span className={styles.plusIcon}>+</span>
            <span>Создать категорию</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect; 
import React, { useState, useRef, useEffect } from 'react';
import { useTaskStore } from '../../../../store/taskStore';
import { useCategoryPopup } from '../../../../context/CategoryPopupContext';
import styles from './CategorySelect.module.css';
import CategoryPopup from './CategoryPopup/CategoryPopup';

const CategorySelect = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const { categories, fetchCategories, categoriesLoading } = useTaskStore();
  const { openPopup } = useCategoryPopup();

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

  const selectedCategory = categories.find(cat => cat.category_id === value) || { name: 'Без категории' };

  return (
    <>
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
            
            {categoriesLoading ? (
              <div className={styles.loading}>Загрузка категорий...</div>
            ) : (
              categories.map(category => (
                <div
                  key={category.category_id}
                  className={`${styles.categoryOption} ${category.category_id === value ? styles.selected : ''}`}
                  onClick={() => handleSelect(category.category_id)}
                >
                  <span>{category.name}</span>
                </div>
              ))
            )}
            
            <div
              className={styles.createCategory}
              onClick={() => {
                setIsOpen(false);
                openPopup();
              }}
            >
              <span className={styles.plusIcon}>+</span>
              <span>Создать категорию</span>
            </div>
          </div>
        )}
      </div>
      <CategoryPopup />
    </>
  );
};

export default CategorySelect; 
import React, { useState } from 'react';
import { useCategoryPopup } from '../../../../../context/CategoryPopupContext';
import { useTaskStore } from '../../../../../store/taskStore';
import { useNotification } from '../../../../../context/NotificationContext';
import * as CategoryDTO from '../../../../../dto/CategoryDTO';
import styles from './CategoryPopup.module.css';

const CategoryPopup = () => {
  const { isOpen, closePopup } = useCategoryPopup();
  const { createCategory, categoriesLoading } = useTaskStore();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState(CategoryDTO.createEmptyForm());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showNotification('Название категории обязательно', 'error', 3000, 'bottom');
      return;
    }

    try {
      const newCategory = await createCategory(formData);
      showNotification(`Категория "${newCategory.name}" успешно создана`, 'success', 3000, 'bottom');
      closePopup();
    } catch (err) {
      console.error('Error in popup:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.stopPropagation()}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2>Новая категория</h2>
          <button type="button" className={styles.closeButton} onClick={closePopup}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Название категории"
              className={styles.input}
            />
          </div>

          <div className={styles.actions}>
            <button 
              type="button" 
              onClick={handleSubmit} 
              className={styles.submitButton} 
              disabled={categoriesLoading || !formData.name.trim()}
            >
              {categoriesLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button type="button" onClick={closePopup} className={styles.cancelButton}>
              Отменить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPopup; 
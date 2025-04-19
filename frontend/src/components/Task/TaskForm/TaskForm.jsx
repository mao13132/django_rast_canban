import React, { useState } from 'react';
import { useTaskForm } from '../../../context/TaskFormContext';
import styles from './TaskForm.module.css';

const TaskForm = () => {
  const { isOpen, mode, initialData, closeForm } = useTaskForm();
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    priority: 'medium',
    category: 'study',
    deadline: {
      start: '',
      end: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('deadline.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deadline: {
          ...prev.deadline,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика сохранения
    closeForm();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <h2>{mode === 'create' ? 'Новая задача' : 'Редактировать задачу'}</h2>
          <button type="button" className={styles.closeButton} onClick={closeForm}>×</button>
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Название задачи"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Приоритет</option>
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Описание"
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.fileUpload}>
            <span>Прикрепить файл</span>
            <input type="file" className={styles.fileInput} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">Категория</option>
            <option value="study">Учеба</option>
            <option value="work">Работа</option>
            <option value="personal">Личное</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.deadlineGroup}>
            <div>
              <label>Начало:</label>
              <input
                type="datetime-local"
                name="deadline.start"
                value={formData.deadline.start}
                onChange={handleChange}
                className={styles.dateInput}
              />
            </div>
            <div>
              <label>Конец:</label>
              <input
                type="datetime-local"
                name="deadline.end"
                value={formData.deadline.end}
                onChange={handleChange}
                className={styles.dateInput}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton}>
            Сохранить
          </button>
          <button type="button" className={styles.cancelButton} onClick={closeForm}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm; 
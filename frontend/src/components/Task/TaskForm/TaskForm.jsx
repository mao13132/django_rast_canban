import React, { useState } from 'react';
import styles from './TaskForm.module.css';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    category: task?.category || '',
    due_date: task?.due_date || '',
    status: task?.status || 'todo'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Название задачи"
          required
        />
      </div>

      <div className={styles.field}>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Описание задачи"
          rows="3"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        <div className={styles.field}>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Категория"
          />
        </div>
      </div>

      <div className={styles.field}>
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton}>
          {task ? 'Сохранить' : 'Создать'}
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Отмена
        </button>
      </div>
    </form>
  );
};

export default TaskForm; 
import React, { useState } from 'react';
import styles from './NoteForm.module.css';

const NoteForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
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
    // Здесь будет логика сохранения заметки
    console.log('Save note:', formData);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <h2>Новая заметка</h2>
          <button type="button" className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Название заметки"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Содержание заметки"
            className={styles.textarea}
            required
          />
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} className={styles.cancelButton}>
            Отмена
          </button>
          <button type="submit" className={styles.submitButton}>
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm; 
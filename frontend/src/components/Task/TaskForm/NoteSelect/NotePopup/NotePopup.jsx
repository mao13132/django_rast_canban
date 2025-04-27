import React, { useState } from 'react';
import { useNotePopup } from '../../../../../context/NotePopupContext';
import { useTaskStore } from '../../../../../store/taskStore';
import { useNotification } from '../../../../../context/NotificationContext';
import styles from './NotePopup.module.css';

const NotePopup = ({ onNoteCreated }) => {
  const { isOpen, closePopup } = useNotePopup();
  const { createNote } = useTaskStore();
  const { showNotification } = useNotification();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = async () => {
    try {
      const newNote = await createNote({ title, content, is_pinned: isPinned });
      showNotification('Заметка успешно создана', 'success', 3000, 'bottom');
      closePopup();
      // Автоматически выбираем созданную заметку
      if (onNoteCreated) {
        onNoteCreated(newNote.id);
      }
    } catch (error) {
      showNotification('Ошибка при создании заметки', 'error', 3000, 'bottom');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2>Создать заметку</h2>
          <button className={styles.closeButton} onClick={closePopup}>×</button>
        </div>
        <div className={styles.formGroup}>
          <input
            type="text"
            className={styles.input}
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <textarea
            className={styles.input}
            placeholder="Содержимое"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
            />
            <span>Закрепить заметку</span>
          </label>
        </div>
        <div className={styles.actions}>
          <button 
            type="button" 
            className={styles.cancelButton} 
            onClick={closePopup}
          >
            Отмена
          </button>
          <button 
            type="button" 
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!title || !content}
          >
            Создать
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotePopup; 
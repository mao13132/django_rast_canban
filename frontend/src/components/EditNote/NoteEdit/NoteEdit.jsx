import React, { useState, useEffect } from 'react';
import styles from './NoteEdit.module.css';

/**
 * Компонент для редактирования заметки
 * @param {Object} props - Свойства компонента
 * @param {Object} props.note - Объект заметки
 * @param {Function} props.onSave - Функция сохранения заметки
 * @param {Function} props.onCancel - Функция отмены редактирования
 */
const NoteEdit = ({ note, onSave, onCancel }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...note, title, content });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
          placeholder="Заголовок"
          required
        />
        <div className={styles.buttons}>
          <button type="button" className={styles.cancelButton} onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className={styles.saveButton}>
            Сохранить
          </button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className={styles.contentInput}
        placeholder="Содержание заметки"
        rows={10}
        required
      />
    </form>
  );
};

export default NoteEdit; 
import React from 'react';
import styles from './EditNoteForm.module.css';

const EditNoteForm = ({ note, onNoteChange, onSave, onCancel }) => {
  const handleTitleChange = (e) => {
    onNoteChange({ ...note, title: e.target.value });
  };

  const handleContentChange = (e) => {
    onNoteChange({ ...note, content: e.target.value });
  };

  return (
    <div className={styles.form}>
      <div className={styles.titleContainer}>
        <input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          className={styles.titleInput}
          placeholder="Введите заголовок"
        />
      </div>

      <div className={styles.contentContainer}>
        <textarea
          value={note.content}
          onChange={handleContentChange}
          className={styles.contentInput}
          placeholder="Введите текст заметки"
          rows={10}
        />
      </div>

      <div className={styles.buttons}>
        <button onClick={onSave} className={styles.saveButton}>
          Сохранить изменения
        </button>
        <button onClick={onCancel} className={styles.cancelButton}>
          Отменить
        </button>
      </div>
    </div>
  );
};

export default EditNoteForm; 
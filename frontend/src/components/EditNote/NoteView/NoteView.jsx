import React from 'react';
import styles from './NoteView.module.css';

/**
 * Компонент для отображения заметки
 * @param {Object} props - Свойства компонента
 * @param {Object} props.note - Объект заметки
 * @param {Function} props.onEdit - Обработчик нажатия на кнопку редактирования
 */
const NoteView = ({ note, onEdit }) => {
  return (
    <div className={styles.note}>
      <div className={styles.header}>
        <h1 className={styles.title}>{note.title}</h1>
        <button className={styles.editButton} onClick={onEdit}>
          Редактировать
        </button>
      </div>
      <div className={styles.content}>{note.content}</div>
    </div>
  );
};

export default NoteView; 
import React from 'react';
import styles from './ArchivedNoteCard.module.css';

const ArchivedNoteCard = ({ note, onRestore, onDelete }) => {
  const { title, content } = note;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.actions}>
          <button 
            onClick={() => onRestore(note.id)} 
            className={styles.restoreButton}
          >
            ↩
          </button>
          <button 
            onClick={() => onDelete(note.id)} 
            className={styles.deleteButton}
          >
            ✕
          </button>
        </div>
      </div>
      <p className={styles.content}>{content}</p>
    </div>
  );
};

export default ArchivedNoteCard; 
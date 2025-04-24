import React from 'react';
import styles from './NoteCard.module.css';

const NoteCard = ({ note, onPin, onArchive, onDelete }) => {
  const { title, content, isPinned, isArchived } = note;

  return (
    <div className={`${styles.card} ${isPinned ? styles.pinned : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.actions}>
          <button 
            onClick={() => onPin(note.id)} 
            className={`${styles.pinButton} ${isPinned ? styles.pinned : ''}`}
          >
            📌
          </button>
          <button 
            onClick={() => onArchive(note.id)} 
            className={`${styles.archiveButton} ${isArchived ? styles.archived : ''}`}
          >
            📦
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

export default NoteCard; 
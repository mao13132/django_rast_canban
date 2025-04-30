import React from 'react';
import styles from './NoteCard.module.css';

const NoteCard = ({ note, onPin, onArchive, onDelete, color }) => {
  const { title, content, is_pinned: isPinned, is_archived: isArchived } = note;

  return (
    <div className={`${styles.card} ${isPinned ? styles.pinned : ''}`} style={{ backgroundColor: color }}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.actions}>
          <img
            src={isPinned ? "/assets/pinned.png" : "/assets/no_pinned.png"}
            alt="Закрепить"
            className={`${styles.pinnedImage} ${isPinned ? styles.active : ''}`}
          />
        </div>
      </div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default NoteCard;
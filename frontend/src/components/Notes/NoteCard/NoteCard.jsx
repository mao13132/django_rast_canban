import React from 'react';
import styles from './NoteCard.module.css';

const NoteCard = ({ note, onPin, onArchive, onDelete, onUnarchive, color }) => {
  const { title, content, is_pinned: isPinned, is_archived: isArchived } = note;

  const handlePinClick = (e) => {
    e.preventDefault();
    onPin(note.id);
  };

  return (
    <div className={`${styles.card} ${isPinned ? styles.pinned : ''}`} style={{ backgroundColor: color }}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.actions}>
          {onPin && (
            <img
              src={isPinned ? "/assets/pinned.png" : "/assets/no_pinned.png"}
              alt="Закрепить"
              className={`${styles.pinnedImage} ${isPinned ? styles.active : ''}`}
              onClick={handlePinClick}
            />
          )}
        </div>
      </div>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <div className={styles.otherActions}>
        {isArchived ? (
          onUnarchive && (
            <img
              onClick={() => onUnarchive(note.id)}
              src="/assets/unarchive.png"
              alt="Разархивировать"
              className={styles.pinnedImage}
            />
          )
        ) : (
          onArchive && (
            <img
              onClick={() => onArchive(note.id)}
              src="/assets/archives.png"
              alt="Архивировать"
              className={styles.pinnedImage}
            />
          )
        )}

        {onDelete && (
          <img
            onClick={() => onDelete(note.id)}
            src="/assets/close.png"
            alt="Удалить"
            className={styles.pinnedImage}
          />
        )}
      </div>
    </div>
  );
};

export default NoteCard;
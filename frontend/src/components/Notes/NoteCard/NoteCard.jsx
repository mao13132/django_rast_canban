import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NoteCard.module.css';

const NoteCard = ({ note, onPin, onArchive, onDelete, onUnarchive, color }) => {
  const { title, content, is_pinned: isPinned, is_archived: isArchived } = note;
  const navigate = useNavigate();

  const handlePinClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPin(note.id);
  };

  const handleCardClick = (e) => {
    // Проверяем, что клик был не по кнопкам действий и не по контенту
    if (!e.target.closest(`.${styles.actions}`) &&
      !e.target.closest(`.${styles.otherActions}`) &&
      !e.target.closest(`.${styles.content}`)) {
      navigate(`/notes/${note.id}/edit`);
    }
  };

  return (
    <div
      className={`${styles.card} ${isPinned ? styles.pinned : ''}`}
      style={{ backgroundColor: color, cursor: 'pointer' }}
      onClick={handleCardClick}
    >
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
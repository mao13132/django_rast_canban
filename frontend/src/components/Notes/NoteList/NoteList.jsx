import React from 'react';
import NoteCard from '../NoteCard/NoteCard';
import styles from './NoteList.module.css';

const NoteList = ({ notes, onPin, onArchive, onDelete, className, color = '#dcf0bb' }) => {
  return (
    <div className={`${styles.list} ${className}`}
    >
      {notes.map(note => (
        <NoteCard
          key={note.note_id}
          note={note}
          onPin={onPin}
          onArchive={onArchive}
          onDelete={onDelete}
          color={color}
        />
      ))}
    </div>
  );
};

export default NoteList;
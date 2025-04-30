import React from 'react';
import NoteCard from '../NoteCard/NoteCard';
import styles from './NoteList.module.css';

const NoteList = ({ notes, onPin, onArchive, onDelete }) => {
  return (
    <div className={styles.list}>
      {notes.map(note => (
        <NoteCard
          key={note.note_id}
          note={note}
          onPin={onPin}
          onArchive={onArchive}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NoteList;
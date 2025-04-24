import React from 'react';
import NoteCard from '../NoteCard/NoteCard';
import styles from './NoteList.module.css';

const NoteList = ({ type, searchQuery }) => {
  // Здесь будет логика получения заметок из store
  const notes = [
    {
      id: 1,
      title: 'Скороговорки',
      content: 'ехал грека через реку видит грека в речке рак',
      isPinned: true,
      isArchived: false
    },
    {
      id: 2,
      title: 'Стихи',
      content: 'У лукоморья дуб зеленый',
      isPinned: true,
      isArchived: false
    },
    {
      id: 3,
      title: 'Сделать',
      content: 'Купить жвачку\nКупить мандарин',
      isPinned: false,
      isArchived: false
    }
  ];

  const filteredNotes = notes.filter(note => {
    if (type === 'pinned' && !note.isPinned) return false;
    if (type === 'other' && note.isPinned) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handlePin = (id) => {
    // Здесь будет логика закрепления заметки
    console.log('Pin note:', id);
  };

  const handleArchive = (id) => {
    // Здесь будет логика архивации заметки
    console.log('Archive note:', id);
  };

  const handleDelete = (id) => {
    // Здесь будет логика удаления заметки
    console.log('Delete note:', id);
  };

  return (
    <div className={styles.list}>
      {filteredNotes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onPin={handlePin}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default NoteList; 
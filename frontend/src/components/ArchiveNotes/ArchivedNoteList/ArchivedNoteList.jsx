import React from 'react';
import ArchivedNoteCard from '../ArchivedNoteCard/ArchivedNoteCard';
import styles from './ArchivedNoteList.module.css';

const ArchivedNoteList = ({ searchQuery }) => {
  // Здесь будет логика получения архивных заметок из store
  const notes = [
    {
      id: 1,
      title: 'Скороговорки',
      content: 'ехал грека через реку видит грека в речке рак',
      isArchived: true
    },
    {
      id: 2,
      title: 'Стихи',
      content: 'У лукоморья дуб зеленый',
      isArchived: true
    },
    {
      id: 3,
      title: 'Сделать',
      content: 'Купить жвачку\nКупить мандарин',
      isArchived: true
    }
  ];

  const filteredNotes = notes.filter(note => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleRestore = (id) => {
    // Здесь будет логика восстановления заметки
    console.log('Restore note:', id);
  };

  const handleDelete = (id) => {
    // Здесь будет логика удаления заметки
    console.log('Delete note:', id);
  };

  return (
    <div className={styles.list}>
      {filteredNotes.map(note => (
        <ArchivedNoteCard
          key={note.id}
          note={note}
          onRestore={handleRestore}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default ArchivedNoteList; 
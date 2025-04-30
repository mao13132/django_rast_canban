import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNoteStore } from '../../store/noteStore';
import Header from '../../components/Header';
import { useNoteOperations } from '../../hooks/useNoteOperations';
import SubHeader from '../../components/SubHeader/SubHeader';
import NoteList from '../../components/Notes/NoteList/NoteList';
import SearchBar from '../../components/UI/SearchBar';
import styles from './ArchiveNotes.module.css';

const ArchiveNotes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchNotes, getFilteredNotes, updateNote, deleteNote } = useNoteStore();

  const { handlePin, handleArchive, handleDelete, handleUnarchive } = useNoteOperations(searchQuery);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Сначала получаем все архивные заметки
  const archivedNotes = getFilteredNotes(searchQuery).filter(note => note.is_archived);

  return (
    <div className={styles.archiveContainer}>

      <main className={styles.archive}>
        <Header
          navigationLinks={[
            { label: 'Главная страница', path: '/' },
            { label: 'Файлы', path: '/files' }
          ]}
        />
        <div className={styles.contentWrapper}>
          <SubHeader
            title="Архив заметок"
            navLinks={[
              { label: 'Заметки', path: '/notes' },
              { label: 'Доска задач', path: '/' }
            ]}
          />

          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Поиск заметок'
          />

          <div className={styles.content}>
            <NoteList
              notes={archivedNotes}
              onArchive={handleArchive}
              onUnarchive={handleUnarchive}
              onDelete={handleDelete}
              className={styles.pinnedList}
              color={`#d5d7ea`}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default ArchiveNotes; 
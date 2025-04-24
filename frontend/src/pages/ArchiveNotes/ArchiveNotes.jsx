import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import ArchivedNoteList from '../../components/ArchiveNotes/ArchivedNoteList/ArchivedNoteList';
import SearchBar from '../../components/ArchiveNotes/SearchBar/SearchBar';
import styles from './ArchiveNotes.module.css';

const ArchiveNotes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={styles.archiveContainer}>
      <Header />
      <main className={styles.archive}>
        <div className={styles.header}>
          <h1>Архив заметок</h1>
          <div className={styles.actions}>
            <SearchBar 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск заметок"
            />
          </div>
        </div>

        <div className={styles.subHeader}>
          <span onClick={() => navigate('/notes')} className={styles.link}>Заметки</span>
          <span onClick={() => navigate('/')} className={styles.link}>Доска задач</span>
        </div>

        <div className={styles.content}>
          <ArchivedNoteList searchQuery={searchQuery} />
        </div>
      </main>
    </div>
  );
};

export default ArchiveNotes; 
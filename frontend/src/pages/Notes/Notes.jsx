import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import NoteList from '../../components/Notes/NoteList/NoteList';
import NoteForm from '../../components/Notes/NoteForm/NoteForm';
import SearchBar from '../../components/Notes/SearchBar/SearchBar';
import styles from './Notes.module.css';

const Notes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateNote = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div className={styles.notesContainer}>
      <Header />
      <main className={styles.notes}>
        <div className={styles.header}>
          <h1>Заметки</h1>
          <div className={styles.actions}>
            <SearchBar 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск заметок"
            />
            <button 
              className={styles.createButton}
              onClick={handleCreateNote}
            >
              Создать
            </button>
          </div>
        </div>

        <div className={styles.subHeader}>
          <span onClick={() => navigate('/')} className={styles.link}>Доска задач</span>
          <span>Архив заметок</span>
        </div>

        <div className={styles.content}>
          <section className={styles.pinnedSection}>
            <h2>Закрепленные заметки</h2>
            <NoteList type="pinned" searchQuery={searchQuery} />
          </section>

          <section className={styles.otherSection}>
            <h2>Другие заметки</h2>
            <NoteList type="other" searchQuery={searchQuery} />
          </section>
        </div>

        {isFormOpen && <NoteForm onClose={handleCloseForm} />}
      </main>
    </div>
  );
};

export default Notes; 
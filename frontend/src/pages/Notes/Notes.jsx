import React, { useState } from 'react';
import Header from '../../components/Header';
import NoteList from '../../components/Notes/NoteList/NoteList';
import SearchBar from '../../components/Notes/SearchBar/SearchBar';
import SubHeader from '../../components/SubHeader/SubHeader';
import TaskControls from '../../components/TaskControls/TaskControls';
import NoteEditor from '../../components/Notes/NoteEditor/NoteEditor';
import styles from './Notes.module.css';

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={styles.notesContainer}>
      <main className={styles.notes}>
        <Header
          navigationLinks={[
            { label: 'Главная страница', path: '/' },
            { label: 'Файлы', path: '/files' }
          ]}
        />

        <div className={styles.contentWrapper}>
          <SubHeader
            title="Заметки"
            navLinks={[
              { label: 'Заметки', path: '/notes', isActive: true },
              { label: 'Архив заметок', path: '/archive' },
              { label: 'Хранилище', path: '/files' }
            ]}
            rightComponent={<TaskControls />}
          />

          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Поиск задач'
          />

          <div className={styles.content}>
            <div className={styles.formWrapper}>
              <NoteEditor className={styles.createForm} />
            </div>

            <section className={styles.otherSection}>
              <h2>Другие заметки</h2>
              <NoteList type="other" searchQuery={searchQuery} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notes;
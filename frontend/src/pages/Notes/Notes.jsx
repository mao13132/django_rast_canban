import React, { useState, useEffect } from 'react';
import { useNoteEditor } from '../../context/NoteEditorContext';
import Header from '../../components/Header';
import NoteList from '../../components/Notes/NoteList/NoteList';
import SearchBar from '../../components/UI/SearchBar';
import SubHeader from '../../components/SubHeader/SubHeader';
import NotesControls from '../../components/NotesControls/NotesControls';
import NoteEditor from '../../components/Notes/NoteEditor/NoteEditor';
import { useNoteStore } from '../../store/noteStore';
import { useNoteOperations } from '../../hooks/useNoteOperations';
import styles from './Notes.module.css';

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchNotes, getFilteredNotes } = useNoteStore();
  const { isEditorVisible } = useNoteEditor();
  const { handlePin, handleArchive, handleDelete } = useNoteOperations(searchQuery);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Сначала получаем все неархивные заметки
  const activeNotes = getFilteredNotes(searchQuery).filter(note => !note.is_archived);
  
  // Затем разделяем на закрепленные и обычные
  const pinnedNotes = activeNotes.filter(note => note.is_pinned);
  const otherNotes = activeNotes.filter(note => !note.is_pinned);

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
              { label: 'Архив заметок', path: '/archive' },
              { label: 'Доска задач', path: '/' }
            ]}
            rightComponent={<NotesControls />}
          />

          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Поиск заметок'
          />

          <div className={styles.content}>
            {isEditorVisible && (
              <div className={styles.formWrapper}>
                <NoteEditor className={styles.createForm} />
              </div>
            )}

            <section className={styles.pinnedSection}>
              <h2>Закрепленные заметки</h2>
              <NoteList 
                notes={pinnedNotes}
                onPin={handlePin}
                onArchive={handleArchive}
                onDelete={handleDelete}
                className={styles.pinnedList}
                color={`#dcf0bb`}
              />
            </section>

            <section className={styles.otherSection}>
              <h2>Другие заметки</h2>
              <NoteList 
                notes={otherNotes}
                onPin={handlePin}
                onArchive={handleArchive}
                onDelete={handleDelete}
                className={styles.otherList}
                color={`#ebdfc8`}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notes;
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import NoteList from '../../components/Notes/NoteList/NoteList';
import SearchBar from '../../components/UI/SearchBar';
import SubHeader from '../../components/SubHeader/SubHeader';
import TaskControls from '../../components/TaskControls/TaskControls';
import NoteEditor from '../../components/Notes/NoteEditor/NoteEditor';
import { useNoteStore } from '../../store/noteStore';
import styles from './Notes.module.css';

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { fetchNotes, getFilteredNotes, updateNote, deleteNote } = useNoteStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handlePin = async (id) => {
    const note = getFilteredNotes(searchQuery).find(n => n.note_id === id);
    if (note) {
      await updateNote(id, { ...note, is_pinned: !note.is_pinned });
    }
  };

  const handleArchive = async (id) => {
    const note = getFilteredNotes(searchQuery).find(n => n.note_id === id);
    if (note) {
      await updateNote(id, { ...note, is_archived: !note.is_archived });
    }
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
  };

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
            rightComponent={<TaskControls />}
          />

          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Поиск заметок'
          />

          <div className={styles.content}>
            <div className={styles.formWrapper}>
              <NoteEditor className={styles.createForm} />
            </div>

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
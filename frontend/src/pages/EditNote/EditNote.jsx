import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNoteStore } from '../../store/noteStore';
import { useNoteEditing } from '../../hooks/useNoteEditing';
import SubHeader from '../../components/SubHeader/SubHeader';
import Header from '../../components/Header';
import styles from './EditNote.module.css';

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, fetchNotes } = useNoteStore();
  const {
    title,
    setTitle,
    isPinned,
    setIsPinned,
    textAreaRef,
    handleFormatting,
    saveNote
  } = useNoteEditing();

  useEffect(() => {
    const loadNote = async () => {
      await fetchNotes();
      const note = notes.find(note => note.id === Number(id));
      if (note) {
        setTitle(note.title);
        setIsPinned(note.is_pinned);
        if (textAreaRef.current) {
          textAreaRef.current.innerHTML = note.content;
        }
      }
    };
    loadNote();
  }, [id, fetchNotes]);

  const handleSave = async () => {
    const success = await saveNote(id);
    if (success) {
      navigate('/notes');
    }
  };

  return (
    <div className={styles.container}>
      <Header
        navigationLinks={[
          { label: 'Главная страница', path: '/' },
          { label: 'Файлы', path: '/files' }
        ]}
      />

      <div className={styles.contentWrapper}>
        <SubHeader
          title={title}
          navLinks={[
            { label: 'Заметки', path: '/notes' },
            { label: 'Архив заметок', path: '/archive' },
            { label: 'Доска задач', path: '/' }
          ]}
        />

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Заголовок"
          className={styles.titleInput}
        />
        <div
          ref={textAreaRef}
          contentEditable="true"
          className={styles.contentInput}
          data-placeholder="Заметка..."
        />

        <div className={styles.createFormIcons}>
          {['checkbox', 'bold', 'italic', 'underline', 'strikethrough'].map((type) => (
            <div key={type} className={styles.iconWrapper} onClick={() => handleFormatting(type)}>
              <img
                src={`/assets/${type}.png`}
                alt={type}
                className={styles.textIcon}
              />
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button onClick={handleSave} className={`${styles.btn} ${styles.saveButton}`}>
            Сохранить изменения
          </button>
          <button onClick={() => navigate('/notes')} className={`${styles.btn} ${styles.cancelButton}`}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNote;
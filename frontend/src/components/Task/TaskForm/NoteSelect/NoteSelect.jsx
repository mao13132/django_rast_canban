import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../../../store/taskStore';
import { useNotePopup } from '../../../../context/NotePopupContext';
import styles from './NoteSelect.module.css';
import NotePopup from './NotePopup/NotePopup';

const NoteSelect = ({ value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const { notes, notesLoading } = useTaskStore();
  const { openPopup } = useNotePopup();
  const navigate = useNavigate();

  const selectedNote = notes.find(note => note.id === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (noteId) => {
    onChange({ target: { name: 'note', value: noteId } });
    setIsOpen(false);
  };

  const removeNote = (e) => {
    e.stopPropagation(); // Предотвращаем переход на страницу заметки
    onChange({ target: { name: 'note', value: '' } });
  };

  const handleNoteClick = (e) => {
    e.preventDefault();
    if (selectedNote?.id) {
      navigate(`/notes/${selectedNote.id}/edit`);
    }
  };

  if (selectedNote) {
    return (
      <div className={`${styles.noteSelect} ${className}`}>
        <div 
          className={styles.selectedNoteDisplay}
          onClick={handleNoteClick}
        >
          <div className={styles.noteOption}>
            <span>{selectedNote.title}</span>
          </div>
          <button
            type="button"
            onClick={removeNote}
            className={styles.removeNote}
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.noteSelect} ${className}`} ref={selectRef}>
        <div 
          className={styles.noteSelectHeader} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={styles.noteOption}>
            <span>Без заметки</span>
          </div>
          <div className={styles.selectArrow}>
            <img src="/assets/arrow.png" alt="▼" className={styles.arrowIcon} />
          </div>
        </div>
        
        {isOpen && (
          <div className={styles.noteOptions}>
            <div
              className={`${styles.noteOption} ${!value ? styles.selected : ''}`}
              onClick={() => handleSelect('')}
            >
              <span>Без заметки</span>
            </div>
            
            {notesLoading ? (
              <div className={styles.loading}>Загрузка заметок...</div>
            ) : (
              notes.map(note => (
                <div
                  key={note.id}
                  className={`${styles.noteOption} ${note.id === value ? styles.selected : ''}`}
                  onClick={() => handleSelect(note.id)}
                >
                  <span>{note.title}</span>
                </div>
              ))
            )}
            
            <div
              className={styles.createNote}
              onClick={() => {
                setIsOpen(false);
                openPopup();
              }}
            >
              <span className={styles.plusIcon}>+</span>
              <span>Создать заметку</span>
            </div>
          </div>
        )}
      </div>
      <NotePopup onNoteCreated={handleSelect} />
    </>
  );
};

export default NoteSelect; 
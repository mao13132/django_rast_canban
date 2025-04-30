import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNoteEditor } from '../../context/NoteEditorContext';
import styles from './NotesControls.module.css';

const NotesControls = () => {
  const navigate = useNavigate();
  const { toggleEditor } = useNoteEditor();

  return (
    <div className={styles.controls}>
      <button
        className={styles.createButton}
        onClick={toggleEditor}
      >
        Создать
      </button>
      <div className={styles.menuContainer}>
        <div className={styles.imageContainer}>
          <img onClick={() => navigate('/archive')} src="/assets/atchives_btn.png" alt="Логотип" className={styles.sortImage} />
        </div>
      </div>
    </div>
  );
};

export default NotesControls;
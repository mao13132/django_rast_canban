import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditNote.module.css';
import { useNotes } from '../../context/NotesContext';

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNote, updateNote } = useNotes();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      const noteData = await getNote(id);
      if (noteData) {
        setNote(noteData);
        setTitle(noteData.title);
        setContent(noteData.content);
      }
    };
    fetchNote();
  }, [id, getNote]);

  const handleSave = async () => {
    if (note) {
      await updateNote(id, { ...note, title, content });
      navigate('/notes');
    }
  };

  const handleCancel = () => {
    navigate('/notes');
  };

  if (!note) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <div className={styles.content}>
        <textarea
          className={styles.contentText}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Введите текст заметки..."
        />
      </div>
      <div className={styles.buttons}>
        <button className={styles.cancelButton} onClick={handleCancel}>
          Отменить
        </button>
        <button className={styles.saveButton} onClick={handleSave}>
          Сохранить изменения
        </button>
      </div>
    </div>
  );
};

export default EditNote; 
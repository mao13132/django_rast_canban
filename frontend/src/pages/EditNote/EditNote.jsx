import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '../../store/taskStore';
import { useNotification } from '../../context/NotificationContext';
import styles from './EditNote.module.css';

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getNote, updateNote } = useTaskStore();
  const { showNotification } = useNotification();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const loadNote = async () => {
      const note = await getNote(id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
        setIsPinned(note.is_pinned);
      }
    };
    loadNote();
  }, [id, getNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateNote(id, { title, content, is_pinned: isPinned });
      showNotification('Заметка успешно обновлена', 'success', 3000, 'bottom');
      navigate('/notes');
    } catch (error) {
      showNotification('Ошибка при обновлении заметки', 'error', 3000, 'bottom');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Редактировать заметку</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Заголовок</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="content">Содержимое</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
            />
            Закрепить заметку
          </label>
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={() => navigate('/notes')}>
            Отмена
          </button>
          <button type="submit">Сохранить</button>
        </div>
      </form>
    </div>
  );
};

export default EditNote; 
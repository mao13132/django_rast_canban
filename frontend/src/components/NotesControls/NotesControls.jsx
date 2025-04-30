import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotesControls.module.css';

/**
 * Компонент для управления задачами (создание и фильтрация)
 * @param {Object} props - Свойства компонента
 */
const NotesControls = () => {

  const navigate = useNavigate();

  return (
    <div className={styles.controls}>
      <button
        className={styles.createButton}
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
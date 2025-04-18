import React, { useEffect } from 'react';
import { usePopup } from '../../context/PopupContext';
import styles from './Popup.module.css';

const Popup = () => {
  const { isOpen, content, title, closePopup } = usePopup();

  // Обработка клавиши Escape для закрытия модального окна
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        closePopup();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
/*     // Блокируем прокрутку страницы при открытии модального окна
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } */

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      /* document.body.style.overflow = 'auto'; */
    };
  }, [isOpen, closePopup]);

  // Обработчик клика по оверлею для закрытия модального окна
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      closePopup();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.popup}>
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button 
            className={styles.closeButton} 
            onClick={closePopup} 
            aria-label="Закрыть"
          >
            &times;
          </button>
        </div>
        <div className={styles.content}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default Popup; 
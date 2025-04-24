import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FileNavigation.module.css';

const FileNavigation = ({ currentType = 'all' }) => {
  const navigate = useNavigate();

  const handleNavigate = (type) => {
    switch (type) {
      case 'all':
        navigate('/files');
        break;
      case 'favorite':
        navigate('/files/favorite');
        break;
      case 'trash':
        navigate('/files/trash');
        break;
      default:
        navigate('/files');
    }
  };

  return (
    <div className={styles.navigation}>
      <button 
        className={`${styles.navButton} ${currentType === 'favorite' ? styles.active : ''}`}
        onClick={() => handleNavigate('favorite')}
      >
        Избранное
      </button>
      <button className={styles.createButton}>Создать</button>
      <button 
        className={`${styles.navButton} ${currentType === 'trash' ? styles.active : ''}`}
        onClick={() => handleNavigate('trash')}
      >
        Корзина
      </button>
    </div>
  );
};

export default FileNavigation; 
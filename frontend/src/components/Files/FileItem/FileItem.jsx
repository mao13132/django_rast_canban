import React from 'react';
import styles from './FileItem.module.css';

const FileItem = ({ file }) => {
  const { name, type, size, isFavorite, isDeleted } = file;

  const getIcon = () => {
    switch (type) {
      case 'folder':
        return '📁';
      case 'file':
        return '📄';
      case 'link':
        return '🔗';
      default:
        return '📄';
    }
  };

  return (
    <div className={styles.fileItem}>
      <div className={styles.name}>
        <span className={styles.icon}>{getIcon()}</span>
        <span className={styles.text}>{name}</span>
      </div>
      <div className={styles.type}>
        <span className={styles.text}>{type}</span>
      </div>
      <div className={styles.size}>
        <span className={styles.text}>{size}</span>
        {!isDeleted && (
          <button 
            className={`${styles.favoriteButton} ${isFavorite ? styles.favorite : ''}`}
            title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        )}
        {isDeleted && (
          <button 
            className={styles.restoreButton}
            title="Восстановить"
          >
            🔄
          </button>
        )}
      </div>
    </div>
  );
};

export default FileItem; 
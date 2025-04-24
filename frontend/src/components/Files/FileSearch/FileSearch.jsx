import React from 'react';
import styles from './FileSearch.module.css';

const FileSearch = () => {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Поиск файлов"
      />
      <button className={styles.searchButton}>
        🔍
      </button>
    </div>
  );
};

export default FileSearch; 
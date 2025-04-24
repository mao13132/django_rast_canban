import React from 'react';
import styles from './StorageInfo.module.css';

const StorageInfo = () => {
  const used = 8;
  const total = 10;
  const percentage = (used / total) * 100;

  return (
    <div className={styles.storageInfo}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progress} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className={styles.text}>
        Использовано {used} Гб из {total}
      </p>
    </div>
  );
};

export default StorageInfo; 
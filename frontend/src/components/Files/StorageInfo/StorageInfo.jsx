import React, { useEffect } from 'react';
import styles from './StorageInfo.module.css';
import { useFileStore } from '../../../store/fileStore';

const StorageInfo = () => {
  const { totalSize, fetchTotalSize } = useFileStore();
  
  useEffect(() => {
    fetchTotalSize();
  }, []);

  // Конвертируем байты в гигабайты
  const used = Math.round((totalSize / (1024 * 1024 * 1024)) * 100) / 100;
  const total = 10; // Максимальный размер в ГБ
  const percentage = Math.min((used / total) * 100, 100);

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
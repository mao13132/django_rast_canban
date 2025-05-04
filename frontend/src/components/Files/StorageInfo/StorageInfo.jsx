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
      <div className={styles.wrapperContent}>
        <div className={styles.iconWrapper}>
          <img src={"/assets/progress.png"} alt="Использованно места" className={styles.icon} />
        </div>

        <div className={styles.content}>

          <div className={styles.textWrapper}>
            <p className={styles.text}>
              Использовано {used} Гб из {total}
            </p>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${percentage}%` }}
            />
          </div>

        </div>

      </div>



    </div>
  );
};

export default StorageInfo;
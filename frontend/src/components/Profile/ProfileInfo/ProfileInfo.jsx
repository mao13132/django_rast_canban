import React from 'react';
import styles from './ProfileInfo.module.css';

const ProfileInfo = () => {
  return (
    <div className={styles.info}>
      <div className={styles.infoItem}>
        <span className={styles.label}>Email</span>
        <span className={styles.value}>15.sweet.as.melon</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.label}>Дата рождения</span>
        <span className={styles.value}>19.06.2003</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.label}>Мобильный телефон</span>
        <span className={styles.value}>+7 905 184 98 84</span>
      </div>
    </div>
  );
};

export default ProfileInfo; 
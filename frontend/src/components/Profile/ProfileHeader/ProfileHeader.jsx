import React from 'react';
import styles from './ProfileHeader.module.css';

const ProfileHeader = () => {
  return (
    <div className={styles.header}>
      <div className={styles.avatarContainer}>
        <img 
          src="https://via.placeholder.com/150" 
          alt="Аватар" 
          className={styles.avatar}
        />
        <button className={styles.editPhotoButton}>
          Редактировать фото
        </button>
      </div>
      <div className={styles.info}>
        <h2 className={styles.name}>Курякова Анастасия</h2>
        <p className={styles.email}>email</p>
      </div>
    </div>
  );
};

export default ProfileHeader; 
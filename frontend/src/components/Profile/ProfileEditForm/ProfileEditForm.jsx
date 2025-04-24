import React from 'react';
import styles from './ProfileEditForm.module.css';

const ProfileEditForm = () => {
  return (
    <div className={styles.form}>
      <h2 className={styles.title}>Данные пользователя</h2>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>Логин (email)</label>
          <input type="email" className={styles.input} defaultValue="15.sweet.as.melon" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Имя</label>
          <input type="text" className={styles.input} defaultValue="Анастасия" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Фамилия</label>
          <input type="text" className={styles.input} defaultValue="Курякова" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Отчество</label>
          <input type="text" className={styles.input} />
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm; 
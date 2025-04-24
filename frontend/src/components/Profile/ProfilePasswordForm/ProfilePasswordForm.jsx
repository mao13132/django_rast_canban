import React from 'react';
import styles from './ProfilePasswordForm.module.css';

const ProfilePasswordForm = () => {
  return (
    <div className={styles.form}>
      <h2 className={styles.title}>Изменить пароль</h2>
      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>Текущий пароль</label>
          <input type="password" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Новый пароль</label>
          <input type="password" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Подтверждение нового пароля</label>
          <input type="password" className={styles.input} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePasswordForm; 
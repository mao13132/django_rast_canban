import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileEditActions.module.css';

const ProfileEditActions = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    // TODO: Добавить логику сохранения
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className={styles.actions}>
      <button className={styles.cancelButton} onClick={handleCancel}>
        Отменить
      </button>
      <button className={styles.saveButton} onClick={handleSave}>
        Сохранить изменения
      </button>
    </div>
  );
};

export default ProfileEditActions; 
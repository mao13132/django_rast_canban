import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileActions.module.css';

const ProfileActions = () => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/profile/edit');
  };

  return (
    <div className={styles.actions}>
      <button className={styles.editButton} onClick={handleEdit}>
        Редактировать профиль
      </button>
    </div>
  );
};

export default ProfileActions; 
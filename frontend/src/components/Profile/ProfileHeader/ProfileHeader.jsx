import React from 'react';
import styles from './ProfileHeader.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const ProfileHeader = () => {
  const { user, handleAvatarChange } = useAuth();

  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/profile/edit');
  };

  return (
    <div className={styles.header}>
      <div className={styles.avatarContainer}>
        <div className={styles.editPhotoButton}>
          <label className={styles.changeAvatar} htmlFor="avatar-upload">
            <img src="/assets/pencil.png" alt="Редактировать" className={styles.logoImage} />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>
        <img
          src={user?.avatar || "/assets/avatar.png"}
          alt="Аватар"
          className={styles.avatar}
        />
      </div>
      <div className={styles.info}>
        <h2 className={styles.name}>{`${user?.firstName} ${user?.lastName}` || 'Пользователь'}</h2>
        <p className={styles.email}>{user?.email}</p>
        <button className={styles.editButton} onClick={handleEdit}>
          Редактировать профиль
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
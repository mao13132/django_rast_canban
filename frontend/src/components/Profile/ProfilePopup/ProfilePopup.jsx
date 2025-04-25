import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useProfile } from '../../../context/ProfileContext';
import styles from './ProfilePopup.module.css';

const ProfilePopup = () => {
  const { user, logout } = useAuth();
  const { isProfileOpen, closeProfile } = useProfile();

  if (!isProfileOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeProfile}>
      <div className={styles.container} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Мой профиль</h2>
          <button className={styles.closeButton} onClick={closeProfile}>×</button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.avatar}>
            {/* Здесь можно добавить аватар пользователя */}
            <div className={styles.avatarPlaceholder}>
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
          
          <div className={styles.info}>
            <h3 className={styles.name}>{user?.email || 'Пользователь'}</h3>
            <p className={styles.email}>{user?.email}</p>
          </div>
          
          <button className={styles.logoutButton} onClick={logout}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup; 
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useProfile } from '../../../context/ProfileContext';
import styles from './ProfilePopup.module.css';

const ProfilePopup = () => {
  const { user, logout } = useAuth();
  const { isProfileOpen, closeProfile } = useProfile();
  const navigate = useNavigate();

  if (!isProfileOpen) return null;

  const handleLogout = () => {
    logout();
    closeProfile();
  }

  const handleProfileClick = () => {
    navigate('/profile');
    closeProfile();
  }

  return (
    <div className={styles.overlay} onClick={closeProfile}>
      <div className={styles.container} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={closeProfile}><span>×</span></button>

        <div className={styles.containerTop}>
          <div className={styles.avatarWrapper}>
            <img src={user?.avatar || "/assets/avatar.png"} alt="Аватар" className={styles.logoImage} />
          </div>

          <div className={styles.info}>
            <div className={styles.name}>{user?.fullName || 'Пользователь'}</div>
            <div className={styles.email}>{user?.email}</div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.containerBottom}>
          <div className={styles.myProfile} onClick={handleProfileClick}>
            <img src={"/assets/profile.png"} alt="Профиль" className={styles.profileImage} />
            <div className={styles.title}>Мой профиль</div>
          </div>

          <div className={styles.logout} onClick={handleLogout}>
            <img src={"/assets/logout.png"} alt="Выйти" className={styles.logoutImage} />
            <button className={styles.logoutButton}>
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup; 
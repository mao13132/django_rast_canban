import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { useProfile } from '../../context/ProfileContext';
/**
 * Компонент Header - главная навигационная панель приложения
 * @returns {JSX.Element} Компонент Header
 */
const Header = ({
  navigationLinks = [],
}) => {
  const navigate = useNavigate();
  const { toggleProfile } = useProfile();

  return (
    <div className={styles.header}>
      <div className={styles.contentWrapper}>
        <div className={styles.leftHeder}>

          <img src="/assets/image_68d8cb1c.png" alt="Логотип" className={styles.logoImage} />

          <div className={styles.navigation}>
            {navigationLinks.map((link, index) => (
              <div className={styles.navigationItem} key={index} onClick={() => navigate(link.path)}>{link.label}</div>
            ))}
          </div>

        </div>
        <div className={styles.rightHeder}>
          <div className={styles.profile}>
            <span onClick={toggleProfile}>Мой профиль</span>
          </div>
        </div>


      </div>

    </div>
  );
};

export default Header; 

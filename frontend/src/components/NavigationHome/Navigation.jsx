import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePopup } from '../../context/PopupContext';
import LoginForm from '../Auth/LoginForm';
import styles from './Navigation.module.css';

const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const { openPopup } = usePopup();

  const handleLoginClick = () => {
    openPopup(<LoginForm />, 'Вход в систему');
  };

  return (
    <div className={styles.mainNavigationContainer}>
      <div className={styles.headerNavigation}>
        <div className={styles.navContainer}>
          <div className={styles.taskboardIcon}>
            <img src="/assets/image_68d8cb1c.png" alt="Логотип" className={styles.logoImage} />
          </div>
          <div className={styles.navigationMenu}>
            <Link to="/" className={styles.mainSectionTitle}>Главная страница</Link>
            <Link to={isAuthenticated ? "/dashboard" : "/"} className={styles.mainSectionTitle}>
              Доска задач
            </Link>
            <Link to={isAuthenticated ? "/files" : "/"} className={styles.mainSectionTitle}>
              Файлы
            </Link>
          </div>
        </div>
        
        <div className={styles.authButtons}>
          {isAuthenticated ? (
            <div onClick={logout} className={styles.authButton}>
              Выйти
            </div>
          ) : (
            <div onClick={handleLoginClick} className={styles.authButton}>
              Войти в ЛК
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation; 
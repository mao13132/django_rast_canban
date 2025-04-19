import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

/**
 * Компонент Header - главная навигационная панель приложения
 * @returns {JSX.Element} Компонент Header
 */
const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            Kanban Board
          </Link>
          <nav className={styles.nav}>
            <Link to="/dashboard" className={styles.navLink}>
              Доска
            </Link>
            <Link to="/tasks" className={styles.navLink}>
              Задачи
            </Link>
            <Link to="/analytics" className={styles.navLink}>
              Аналитика
            </Link>
          </nav>
        </div>
        
        <div className={styles.right}>
          <button className={styles.notificationBtn}>
            <span className={styles.notificationDot} />
            <i className="fas fa-bell" />
          </button>
          <div className={styles.profile}>
            <img 
              src="https://via.placeholder.com/32" 
              alt="Профиль"
              className={styles.avatar}
            />
            <span className={styles.username}>Пользователь</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
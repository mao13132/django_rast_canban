import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Редирект на главную страницу, если пользователь не авторизован
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.dashboard}>

      <div onClick={logout} className={styles.authButton}>
        Выйти
      </div>
      <h1>Панель управления</h1>
      <p>Добро пожаловать в ваш личный кабинет!</p>

      {/* Здесь будет содержимое дашборда */}
      <div className={styles.dashboardContent}>
        <p>Здесь будут ваши задачи и проекты</p>
      </div>
    </div>
  );
};

export default Dashboard; 
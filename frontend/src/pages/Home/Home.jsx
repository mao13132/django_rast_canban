import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navigation from '../../components/Header/Navigation';
import styles from './Home.module.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Редирект на дашборд, если пользователь авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.homePage}>
      <Navigation />
      
      <div className={styles.content}>
        <h1 className={styles.heading}>Ваш личный помощник в учебе!</h1>
        <p className={styles.description}>
          Веб сайт предлагает Вам сделать учебный процесс легче!
        </p>
        <p className={styles.subDescription}>
          Что мы предлагаем для автоматизации и управления знаниями:
        </p>
        
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <h2>Файловое хранилище</h2>
            <p>Храните, упорядочивайте и делитесь файлами любого типа.</p>
            <p>Мгновенный доступ к файлам с любого устройства.</p>
          </div>
          
          <div className={styles.featureCard}>
            <h2>Создание заметок</h2>
            <p>Записывайте идеи. Создавайте и организуйте заметки.</p>
            <p>Легкий поиск: Быстро находите нужные заметки по ключевым словам.</p>
          </div>
          
          <div className={styles.featureCard}>
            <h2>Доска задач</h2>
            <p>Управляйте своими задачами в канбан-доске.</p>
            <p>Перемещайте задачи между стадиями выполнения и отслеживайте прогресс.</p>
          </div>
        </div>
        
        <div className={styles.helpLink}>
          <a href="#">инструкция для пользователя?</a>
        </div>
      </div>
    </div>
  );
};

export default Home; 
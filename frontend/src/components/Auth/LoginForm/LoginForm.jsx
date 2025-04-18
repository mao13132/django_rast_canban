import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { usePopup } from '../../../context/PopupContext';
import RegisterForm from '../RegisterForm';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, error, formErrors, clearErrors, loading } = useAuth();
  const { closePopup, openPopup } = usePopup();

  // Очищаем ошибки при монтировании компонента
  useEffect(() => {
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const success = await login(email, password);
    if (success) {
      closePopup();
    }
  };

  // Функция для открытия формы регистрации
  const handleRegisterClick = () => {
    openPopup(<RegisterForm />, 'Регистрация');
  };

  // Создаем табы для переключения между формами
  const renderTabs = () => {
    return (
      <div className={styles.tabs}>
        <button 
          className={styles.tab}
          type="button"
          onClick={handleRegisterClick}
        >
          Регистрация
        </button>
        <button 
          className={`${styles.tab} ${styles.activeTab}`}
          type="button" 
        >
          Вход
        </button>
      </div>
    );
  };

  return (
    <div className={styles.formContainer}>
      {renderTabs()}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            disabled={loading}
          />
          {formErrors.email && <p className={styles.error}>{formErrors.email}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            disabled={loading}
          />
          {formErrors.password && <p className={styles.error}>{formErrors.password}</p>}
        </div>
        
        {error && <p className={styles.serverError}>{error}</p>}
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm; 
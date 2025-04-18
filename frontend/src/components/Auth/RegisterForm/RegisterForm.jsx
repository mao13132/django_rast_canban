import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { usePopup } from '../../../context/PopupContext';
import LoginForm from '../LoginForm';
import styles from './RegisterForm.module.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    re_password: ''
  });

  const { register, error, formErrors, clearErrors, loading } = useAuth();
  const { closePopup, openPopup } = usePopup();

  // Очищаем ошибки при монтировании компонента
  useEffect(() => {
    clearErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Отправляем только email и пароль
    const success = await register(formData);
    if (success) {
      closePopup();
    }
  };

  // Функция для открытия формы входа
  const handleLoginClick = () => {
    openPopup(<LoginForm />, 'Вход');
  };

  // Создаем табы для переключения между формами
  const renderTabs = () => {
    return (
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${styles.activeTab}`}
          type="button"
        >
          Регистрация
        </button>
        <button 
          className={styles.tab}
          type="button" 
          onClick={handleLoginClick}
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
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            placeholder="Введите email"
            disabled={loading}
          />
          {formErrors.email && <p className={styles.error}>{formErrors.email}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <input
            type="password"
            name="password"
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
            placeholder="Введите пароль"
            disabled={loading}
          />
          {formErrors.password && <p className={styles.error}>{formErrors.password}</p>}
        </div>
        
        <div className={styles.formGroup}>
          <input
            type="password"
            name="re_password"
            className={styles.input}
            value={formData.re_password}
            onChange={handleChange}
            placeholder="Повторите пароль"
            disabled={loading}
          />
          {formErrors.re_password && <p className={styles.error}>{formErrors.re_password}</p>}
        </div>
        
        {error && <p className={styles.serverError}>{error}</p>}
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться!'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm; 
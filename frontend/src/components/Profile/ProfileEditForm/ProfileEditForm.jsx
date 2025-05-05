import React, { useState, useEffect, useCallback } from 'react';
import styles from './ProfileEditForm.module.css';
import { useAuth } from '../../../context/AuthContext';

const ProfileEditForm = () => {
  const { user, updateProfile, loading, error, formErrors, clearErrors } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Заполняем форму данными пользователя при загрузке
  // Используем useCallback для предотвращения лишних ререндеров
  const initializeForm = useCallback(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [user]);

  useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Сбрасываем сообщение об успехе при изменении данных
    if (successMessage) {
      setSuccessMessage('');
    }
    
    // Очищаем ошибки при изменении данных
    if (error || formErrors[name]) {
      clearErrors();
    }
  };

  // Обработчик отправки формы с предотвращением перезагрузки страницы
  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    
    // Проверяем, были ли изменения
    if (
      user.email === formData.email &&
      user.firstName === formData.firstName &&
      user.lastName === formData.lastName
    ) {
      setSuccessMessage('Данные не были изменены');
      return;
    }
    
    try {
      const success = await updateProfile(formData);
      if (success) {
        setSuccessMessage('Данные успешно обновлены');
        // Не обновляем форму здесь, так как это вызовет перерисовку
      }
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      // Ошибки уже обрабатываются в контексте Auth
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>Данные пользователя</h2>
      
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      
      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}
      
      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>Логин (email)</label>
          <input 
            type="email" 
            name="email"
            className={styles.input} 
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && (
            <div className={styles.fieldError}>{formErrors.email}</div>
          )}
        </div>
        
        <div className={styles.field}>
          <label className={styles.label}>Имя</label>
          <input 
            type="text" 
            name="firstName"
            className={styles.input} 
            value={formData.firstName}
            onChange={handleChange}
          />
          {formErrors.first_name && (
            <div className={styles.fieldError}>{formErrors.first_name}</div>
          )}
        </div>
        
        <div className={styles.field}>
          <label className={styles.label}>Фамилия</label>
          <input 
            type="text" 
            name="lastName"
            className={styles.input} 
            value={formData.lastName}
            onChange={handleChange}
          />
          {formErrors.last_name && (
            <div className={styles.fieldError}>{formErrors.last_name}</div>
          )}
        </div>
      </div>
      
      <div className={styles.actions}>
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
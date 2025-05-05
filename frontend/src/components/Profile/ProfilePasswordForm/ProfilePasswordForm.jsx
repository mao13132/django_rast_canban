import React, { useState } from 'react';
import styles from './ProfilePasswordForm.module.css';
import { useAuth } from '../../../context/AuthContext';

const ProfilePasswordForm = () => {
  const { changePassword, loading, formErrors, error, clearErrors } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Очищаем сообщения об успехе при изменении формы
    if (successMessage) {
      setSuccessMessage('');
    }
    
    // Очищаем ошибки при изменении формы
    if (error || formErrors) {
      clearErrors();
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { currentPassword, newPassword, confirmPassword } = formData;
    const success = await changePassword(currentPassword, newPassword, confirmPassword);
    
    if (success) {
      setSuccessMessage('Пароль успешно изменен');
      // Очищаем форму после успешной смены пароля
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Изменить пароль</h2>
      
      {/* Сообщение об успехе */}
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      
      {/* Общая ошибка */}
      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}
      
      <div className={styles.fields}>
        <div className={styles.field}>
          <label className={styles.label}>Текущий пароль</label>
          <input 
            type="password" 
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className={styles.input} 
          />
          {formErrors?.current_password && (
            <div className={styles.fieldError}>{formErrors.current_password}</div>
          )}
          {formErrors?.currentPassword && (
            <div className={styles.fieldError}>{formErrors.currentPassword}</div>
          )}
        </div>
        
        <div className={styles.field}>
          <label className={styles.label}>Новый пароль</label>
          <input 
            type="password" 
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className={styles.input} 
          />
          {formErrors?.new_password && (
            <div className={styles.fieldError}>{formErrors.new_password}</div>
          )}
          {formErrors?.newPassword && (
            <div className={styles.fieldError}>{formErrors.newPassword}</div>
          )}
        </div>
        
        <div className={styles.field}>
          <label className={styles.label}>Подтверждение нового пароля</label>
          <input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input} 
          />
          {formErrors?.re_new_password && (
            <div className={styles.fieldError}>{formErrors.re_new_password}</div>
          )}
          {formErrors?.confirmPassword && (
            <div className={styles.fieldError}>{formErrors.confirmPassword}</div>
          )}
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
};

export default ProfilePasswordForm;
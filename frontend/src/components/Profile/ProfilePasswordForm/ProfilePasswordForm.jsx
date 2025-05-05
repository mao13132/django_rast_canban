import React, { useState } from 'react';
import styles from './ProfilePasswordForm.module.css';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const ProfilePasswordForm = () => {
  const { changePassword, passwordChangeLoading, formErrors, error, clearErrors } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Очищаем ошибки при изменении формы
    if (error || formErrors) {
      clearErrors();
    }
  };

  // Обработчик сохранения пароля без использования формы
  const handleSave = async () => {
    const { currentPassword, newPassword, confirmPassword } = formData;
    const success = await changePassword(currentPassword, newPassword, confirmPassword);

    if (success) {
      showNotification('Пароль успешно изменен', 'success', 3000, 'bottom');
      // Очищаем форму после успешной смены пароля
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      showNotification('Ошибка при изменении пароля', 'error', 3000, 'bottom');
    }
  };

  // Обработчик отмены - перенаправляет на страницу профиля
  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>Изменить пароль</h2>

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

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.submitButton}
            disabled={passwordChangeLoading}
            onClick={handleSave}
          >
            {passwordChangeLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
          >
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePasswordForm;
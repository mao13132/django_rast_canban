import React, { useState, useEffect, useCallback } from 'react';
import styles from './ProfileEditForm.module.css';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';

const ProfileEditForm = () => {
  const { user, updateProfile, profileUpdateLoading, error, formErrors, clearErrors } = useAuth();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });

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

    // Очищаем ошибки при изменении данных
    if (error || formErrors[name]) {
      clearErrors();
    }
  };

  // Обработчик отправки данных без использования формы
  const handleSave = async (e) => {
    // Предотвращаем стандартное поведение события, если оно есть
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Проверяем, были ли изменения
    if (
      user.email === formData.email &&
      user.firstName === formData.firstName &&
      user.lastName === formData.lastName
    ) {
      showNotification('Данные не были изменены', 'info', 3000, 'bottom');
      return;
    }

    try {
      const success = await updateProfile(formData);
      if (success) {
        showNotification('Данные профиля успешно обновлены', 'success', 3000, 'bottom');
      }
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      showNotification('Ошибка при обновлении профиля', 'error', 3000, 'bottom');
    }
  };

  // Обработчик отмены изменений - возвращает изначальные данные пользователя
  const handleCancel = () => {
    initializeForm();
    showNotification('Изменения отменены', 'info', 3000, 'bottom');
  };

  // Предотвращаем отправку формы при нажатии Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return false;
    }
  };

  return (
    <div className={styles.form} onKeyDown={handleKeyDown}>

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
            onKeyDown={handleKeyDown}
          />
          {formErrors.email && (
            <div className={styles.fieldError}>{formErrors.email}</div>
          )}
        </div>

        <div className={styles.bio}>
          <div className={styles.field}>
            <label className={styles.label}>Имя</label>
            <input
              type="text"
              name="firstName"
              className={styles.input}
              value={formData.firstName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
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
              onKeyDown={handleKeyDown}
            />
            {formErrors.last_name && (
              <div className={styles.fieldError}>{formErrors.last_name}</div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.submitButton}
          disabled={profileUpdateLoading}
          onClick={handleSave}
        >
          {profileUpdateLoading ? 'Сохранение...' : 'Сохранить изменения'}
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
  );
};

export default ProfileEditForm;
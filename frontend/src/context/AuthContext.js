import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI, usersAPI } from '../services/api';
import UserDTO from '../dto/UserDTO';

// Создаем контекст аутентификации
export const AuthContext = createContext(null);

// Хук для использования контекста в компонентах
export const useAuth = () => useContext(AuthContext);

// Провайдер контекста аутентификации
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Проверка наличия токена при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await authAPI.getUser();
          setUser(UserDTO.fromAPI(response.data));
        } catch (err) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setError('Сессия истекла. Пожалуйста, войдите снова.');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Метод для входа пользователя
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      setFormErrors({});
      
      // Валидация
      const errors = {};
      if (!email.trim()) {
        errors.email = 'Введите email';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Некорректный email';
      }
      
      if (!password) {
        errors.password = 'Введите пароль';
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setLoading(false);
        return false;
      }
      
      const response = await authAPI.login(email, password);
      
      // Сохраняем токены в localStorage
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      
      // Получаем данные пользователя
      const userResponse = await authAPI.getUser();
      setUser(UserDTO.fromAPI(userResponse.data));
      
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при входе');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Метод для регистрации пользователя
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      setFormErrors({});
      
      // Валидация
      const errors = {};
      if (!userData.email.trim()) {
        errors.email = 'Введите email';
      } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
        errors.email = 'Некорректный email';
      }
      
      if (!userData.password) {
        errors.password = 'Введите пароль';
      } else if (userData.password.length < 8) {
        errors.password = 'Пароль должен содержать не менее 8 символов';
      }
      
      if (userData.password !== userData.re_password) {
        errors.re_password = 'Пароли не совпадают';
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setLoading(false);
        return false;
      }
      
      try {
        const registerResponse = await authAPI.register(userData);
        
        // После успешной регистрации входим с новыми данными
        return await login(userData.email, userData.password);
      } catch (registerError) {
        const errorMessages = registerError.response?.data;
        
        if (errorMessages) {
          // Формируем читаемое сообщение об ошибке из ответа API
          if (typeof errorMessages === 'object') {
            const formattedErrors = Object.entries(errorMessages)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
            
            setError(formattedErrors);
          } else {
            setError(JSON.stringify(errorMessages));
          }
        } else {
          setError('Ошибка при регистрации');
        }
        return false;
      }
    } finally {
      setLoading(false);
    }
  };

  // Метод для выхода пользователя
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setError(null);
    setFormErrors({});
  };

  // Метод для очистки ошибок
  const clearErrors = () => {
    setError(null);
    setFormErrors({});
  };

  // Метод для обновления данных пользователя
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      setFormErrors({});
      
      // Валидация
      const errors = {};
      if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
        errors.email = 'Некорректный email';
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setLoading(false);
        return false;
      }
      
      // Преобразуем данные в FormData, если есть файл аватара
      let formData;
      if (userData instanceof FormData) {
        formData = userData;
      } else {
        formData = new FormData();
        // Добавляем только определенные поля
        if (userData.email) formData.append('email', userData.email);
        if (userData.firstName) formData.append('first_name', userData.firstName);
        if (userData.lastName) formData.append('last_name', userData.lastName);
        if (userData.avatar) formData.append('avatar', userData.avatar);
      }
      
      const response = await usersAPI.updateProfile(formData);
      setUser(UserDTO.fromAPI(response.data));
      
      return true;
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setError(err.response?.data?.detail || 'Ошибка при обновлении профиля');
      
      // Обработка ошибок валидации с сервера
      if (err.response?.data && typeof err.response.data === 'object') {
        setFormErrors(err.response.data);
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Значение, которое будет доступно в контексте
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await usersAPI.updateProfile(formData);
      setUser(UserDTO.fromAPI(response.data));
    } catch (error) {
      console.error('Ошибка при обновлении аватара:', error);
      setError('Ошибка при обновлении аватара');
    }
  };

  // Метод для смены пароля пользователя
  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      setLoading(true);
      setError(null);
      setFormErrors({});
      
      // Валидация
      const errors = {};
      if (!currentPassword) {
        errors.currentPassword = 'Введите текущий пароль';
      }
      
      if (!newPassword) {
        errors.newPassword = 'Введите новый пароль';
      } else if (newPassword.length < 8) {
        errors.newPassword = 'Пароль должен содержать не менее 8 символов';
      }
      
      if (newPassword !== confirmPassword) {
        errors.confirmPassword = 'Пароли не совпадают';
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setLoading(false);
        return false;
      }
      
      await authAPI.changePassword(currentPassword, newPassword);
      return true;
    } catch (err) {
      console.error('Ошибка при смене пароля:', err);
      
      // Обработка ошибок валидации с сервера
      if (err.response?.data && typeof err.response.data === 'object') {
        setFormErrors(err.response.data);
      } else {
        setError(err.response?.data?.detail || 'Ошибка при смене пароля');
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    formErrors,
    setError,
    clearErrors,
    login,
    register,
    logout,
    changePassword,
    isAuthenticated: !!user,
    handleAvatarChange,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
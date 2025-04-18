import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

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
          setUser(response.data);
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
      setUser(userResponse.data);
      
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
      
      console.log('Отправка запроса на регистрацию:', userData);
      
      try {
        const registerResponse = await authAPI.register(userData);
        console.log('Ответ на регистрацию:', registerResponse.data);
        
        // После успешной регистрации входим с новыми данными
        return await login(userData.email, userData.password);
      } catch (registerError) {
        console.error('Ошибка при регистрации:', registerError);
        console.error('Данные ошибки:', registerError.response?.data);
        
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

  // Значение, которое будет доступно в контексте
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
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 
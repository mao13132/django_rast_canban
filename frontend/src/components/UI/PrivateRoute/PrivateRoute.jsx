import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// Компонент для защиты маршрутов, требующих авторизации
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Показываем индикатор загрузки, пока проверяем авторизацию
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка...</div>;
  }

  // Перенаправляем на главную страницу, если пользователь не авторизован
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;

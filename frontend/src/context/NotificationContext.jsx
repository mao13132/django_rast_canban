import React, { createContext, useContext, useState } from 'react';
import Notification from '../components/Notification/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  if (!children) {
    return null;
  }

  const showNotification = (message, type = 'error', duration = 3000, position = 'top') => {
    // Получаем текущую позицию скролла
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Определяем, находится ли пользователь в нижней части страницы
    const isNearBottom = scrollPosition + windowHeight >= documentHeight - 100;

    // Если пользователь внизу, показываем уведомление снизу
    const finalPosition = isNearBottom ? 'bottom' : position;

    setNotification({ message, type, position: finalPosition });
    setTimeout(() => setNotification(null), duration);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          position={notification.position}
        />
      )}
    </NotificationContext.Provider>
  );
}; 
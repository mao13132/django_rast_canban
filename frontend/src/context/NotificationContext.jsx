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

  const showNotification = (message, type = 'error', duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </NotificationContext.Provider>
  );
}; 
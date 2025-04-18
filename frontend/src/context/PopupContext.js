import React, { createContext, useState, useContext } from 'react';

// Создаем контекст для модальных окон
export const PopupContext = createContext(null);

// Хук для использования контекста в компонентах
export const usePopup = () => useContext(PopupContext);

// Провайдер контекста модальных окон
export const PopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState('');

  // Открыть модальное окно с заданным содержимым и заголовком
  const openPopup = (popupContent, popupTitle = '') => {
    setContent(popupContent);
    setTitle(popupTitle);
    setIsOpen(true);
  };

  // Закрыть модальное окно
  const closePopup = () => {
    setIsOpen(false);
    // Очищаем контент после закрытия с небольшой задержкой (для анимации)
    setTimeout(() => {
      setContent(null);
      setTitle('');
    }, 300);
  };

  // Значение, которое будет доступно в контексте
  const value = {
    isOpen,
    content,
    title,
    openPopup,
    closePopup
  };

  return <PopupContext.Provider value={value}>{children}</PopupContext.Provider>;
}; 
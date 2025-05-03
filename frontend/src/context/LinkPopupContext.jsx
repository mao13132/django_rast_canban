import React, { createContext, useContext, useState } from 'react';

const LinkPopupContext = createContext();

/**
 * Провайдер контекста для управления попапом создания ссылок
 */
export const LinkPopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState(null);

  const openPopup = (folderId = null) => {
    setCurrentFolderId(folderId);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setCurrentFolderId(null);
  };

  return (
    <LinkPopupContext.Provider value={{
      isOpen,
      currentFolderId,
      openPopup,
      closePopup
    }}>
      {children}
    </LinkPopupContext.Provider>
  );
};

/**
 * Хук для использования контекста попапа создания ссылок
 */
export const useLinkPopup = () => {
  const context = useContext(LinkPopupContext);
  if (!context) {
    throw new Error('useLinkPopup должен использоваться внутри LinkPopupProvider');
  }
  return context;
};
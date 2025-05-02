import React, { createContext, useContext, useState } from 'react';

const FolderPopupContext = createContext();

/**
 * Провайдер контекста для управления попапом создания папки
 */
export const FolderPopupProvider = ({ children }) => {
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
    <FolderPopupContext.Provider value={{
      isOpen,
      currentFolderId,
      openPopup,
      closePopup
    }}>
      {children}
    </FolderPopupContext.Provider>
  );
};

/**
 * Хук для использования контекста попапа создания папки
 */
export const useFolderPopup = () => {
  const context = useContext(FolderPopupContext);
  if (!context) {
    throw new Error('useFolderPopup должен использоваться внутри FolderPopupProvider');
  }
  return context;
};
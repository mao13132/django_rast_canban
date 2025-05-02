import React, { createContext, useContext, useState } from 'react';

const FilePopupContext = createContext();

/**
 * Провайдер контекста для управления попапом загрузки файла
 */
export const FilePopupProvider = ({ children }) => {
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
    <FilePopupContext.Provider value={{
      isOpen,
      currentFolderId,
      openPopup,
      closePopup
    }}>
      {children}
    </FilePopupContext.Provider>
  );
};

/**
 * Хук для использования контекста попапа загрузки файла
 */
export const useFilePopup = () => {
  const context = useContext(FilePopupContext);
  if (!context) {
    throw new Error('useFilePopup должен использоваться внутри FilePopupProvider');
  }
  return context;
};
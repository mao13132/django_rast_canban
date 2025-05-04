import React, { createContext, useContext, useState } from 'react';

const RenamePopupContext = createContext();

/**
 * Провайдер контекста для управления попапом переименования файлов и папок
 */
export const RenamePopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [itemData, setItemData] = useState(null);

  const openPopup = (data) => {
    setItemData(data);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setItemData(null);
  };

  return (
    <RenamePopupContext.Provider value={{
      isOpen,
      itemData,
      openPopup,
      closePopup
    }}>
      {children}
    </RenamePopupContext.Provider>
  );
};

/**
 * Хук для использования контекста попапа переименования
 */
export const useRenamePopup = () => {
  const context = useContext(RenamePopupContext);
  if (!context) {
    throw new Error('useRenamePopup должен использоваться внутри RenamePopupProvider');
  }
  return context;
};
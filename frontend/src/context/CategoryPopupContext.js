import React, { createContext, useContext, useState } from 'react';

const CategoryPopupContext = createContext();

export const useCategoryPopup = () => {
  const context = useContext(CategoryPopupContext);
  if (!context) {
    throw new Error('useCategoryPopup must be used within a CategoryPopupProvider');
  }
  return context;
};

export const CategoryPopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <CategoryPopupContext.Provider value={{ isOpen, openPopup, closePopup }}>
      {children}
    </CategoryPopupContext.Provider>
  );
}; 
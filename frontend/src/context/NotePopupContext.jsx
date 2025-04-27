import React, { createContext, useContext, useState } from 'react';

const NotePopupContext = createContext();

export const NotePopupProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <NotePopupContext.Provider value={{ isOpen, openPopup, closePopup }}>
      {children}
    </NotePopupContext.Provider>
  );
};

export const useNotePopup = () => {
  const context = useContext(NotePopupContext);
  if (!context) {
    throw new Error('useNotePopup must be used within a NotePopupProvider');
  }
  return context;
}; 
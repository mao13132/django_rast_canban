import React, { createContext, useContext, useState } from 'react';

const NoteEditorContext = createContext();

export const NoteEditorProvider = ({ children }) => {
  const [isEditorVisible, setIsEditorVisible] = useState(true);

  const showEditor = () => setIsEditorVisible(true);
  const hideEditor = () => setIsEditorVisible(false);
  const toggleEditor = () => setIsEditorVisible(prev => !prev);

  return (
    <NoteEditorContext.Provider value={{ isEditorVisible, showEditor, hideEditor, toggleEditor }}>
      {children}
    </NoteEditorContext.Provider>
  );
};

export const useNoteEditor = () => {
  const context = useContext(NoteEditorContext);
  if (!context) {
    throw new Error('useNoteEditor должен использоваться внутри NoteEditorProvider');
  }
  return context;
};
import React, { createContext, useContext, useState } from 'react';

const FileMenuContext = createContext();

/**
 * Провайдер контекста для управления файловым меню
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние элементы
 */
export const FileMenuProvider = ({ children }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleCreateFolder = () => {
    // Логика создания папки
    setIsMenuVisible(false);
  };

  const handleUploadFolder = () => {
    // Логика загрузки папки
    setIsMenuVisible(false);
  };

  const handleUploadFile = () => {
    // Логика загрузки файла
    setIsMenuVisible(false);
  };

  const handleUploadLink = () => {
    // Логика загрузки ссылки
    setIsMenuVisible(false);
  };

  return (
    <FileMenuContext.Provider
      value={{
        isMenuVisible,
        setIsMenuVisible,
        handleCreateFolder,
        handleUploadFolder,
        handleUploadFile,
        handleUploadLink,
      }}
    >
      {children}
    </FileMenuContext.Provider>
  );
};

/**
 * Хук для использования контекста файлового меню
 * @returns {Object} Объект с методами и состоянием меню
 */
export const useFileMenu = () => {
  const context = useContext(FileMenuContext);
  if (!context) {
    throw new Error('useFileMenu должен использоваться внутри FileMenuProvider');
  }
  return context;
};
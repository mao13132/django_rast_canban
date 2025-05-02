import React from 'react';
import ContextMenu from './ContextMenu/ContextMenu';
import { useFileMenu } from '../../context/FileMenuContext';
import styles from './FileControls.module.css';

/**
 * Компонент для управления файлами
 */
const FileControls = () => {
  const {
    isMenuVisible,
    setIsMenuVisible,
    handleCreateFolder,
    handleUploadFolder,
    handleUploadFile,
    handleUploadLink
  } = useFileMenu();

  const menuItems = [
    {
      label: 'Создать папку',
      onClick: handleCreateFolder,
      icon: '/assets/folder.png'
    },
    {
      label: 'Загрузить папку',
      onClick: handleUploadFolder,
      icon: '/assets/upload-folder.png'
    },
    {
      label: 'Загрузить файл',
      onClick: handleUploadFile,
      icon: '/assets/upload-file.png'
    },
    {
      label: 'Загрузить ссылку',
      onClick: handleUploadLink,
      icon: '/assets/link.png'
    }
  ];

  return (
    <div className={styles.controls}>
      <button
        className={styles.createButton}
        onClick={() => setIsMenuVisible(!isMenuVisible)}
      >
        Создать
      </button>
      <ContextMenu
        isVisible={isMenuVisible}
        menuItems={menuItems}
      />
    </div>
  );
};

export default FileControls;
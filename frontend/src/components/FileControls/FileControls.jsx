import React from 'react';
import { useParams } from 'react-router-dom';
import { useFolderPopup } from '../../context/FolderPopupContext';
import ContextMenu from './ContextMenu/ContextMenu';
import { useFileMenu } from '../../context/FileMenuContext';
import FolderPopup from './FolderPopup/FolderPopup';
import styles from './FileControls.module.css';

const FileControls = () => {
  const { folderId } = useParams();
  const { openPopup } = useFolderPopup();
  const {
    isMenuVisible,
    setIsMenuVisible,
    handleUploadFolder,
    handleUploadFile,
    handleUploadLink
  } = useFileMenu();

  const handleCreateFolder = () => {
    setIsMenuVisible(false);
    openPopup(folderId);
  };

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
      <FolderPopup />
    </div>
  );
};

export default FileControls;
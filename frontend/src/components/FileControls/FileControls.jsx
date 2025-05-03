import React from 'react';
import { useParams } from 'react-router-dom';
import { useFolderPopup } from '../../context/FolderPopupContext';
import { useFilePopup } from '../../context/FilePopupContext';
import ContextMenu from './ContextMenu/ContextMenu';
import { useFileMenu } from '../../context/FileMenuContext';
import FolderPopup from './FolderPopup/FolderPopup';
import FilePopup from './FilePopup/FilePopup';
import { useFolderUpload } from '../../context/FolderUploadContext';
import FolderUploadPopup from './FolderUploadPopup/FolderUploadPopup';
import styles from './FileControls.module.css';

const FileControls = () => {
  const { folderId } = useParams();
  const { openPopup: openFolderPopup } = useFolderPopup();
  const { openPopup: openFilePopup } = useFilePopup();
  const {
    isMenuVisible,
    setIsMenuVisible,
    handleUploadFolder,
    handleUploadLink
  } = useFileMenu();

  const handleCreateFolder = () => {
    setIsMenuVisible(false);
    openFolderPopup(folderId);
  };

  const handleUploadFile = () => {
    setIsMenuVisible(false);
    openFilePopup(folderId);
  };

  const { openPopup: openFolderUploadPopup } = useFolderUpload();

  const handleUploadFilesFolder = () => {
    setIsMenuVisible(false);
    openFolderUploadPopup(folderId);
  };

  const menuItems = [
    {
      label: 'Создать папку',
      onClick: handleCreateFolder,
      icon: '/assets/folder.png'
    },
    {
      label: 'Загрузить папку',
      onClick: handleUploadFilesFolder,
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
      <FilePopup />
      <FolderUploadPopup />
    </div>
  );
};

export default FileControls;
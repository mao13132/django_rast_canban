import React from 'react';
import { useFileSize } from '../../../hooks/useFileSize';
import ContextMenu from '../../FileControls/ContextMenu/ContextMenu';
import { useFileItemMenu } from './useFileItemMenu';
import styles from './FileItem.module.css';

const FileItem = ({ file }) => {
  const { name, type, size, isDeleted } = file;
  const formattedSize = useFileSize(size);
  const { 
    isMenuVisible, 
    setIsMenuVisible, 
    getMenuItems, 
    handleTrash
  } = useFileItemMenu(file);

  const getIcon = () => {
    switch (type) {
      case 'folder': return <img src={file.isFavorite ? "/assets/folder-favorit.png" : "/assets/folders.png"} alt="Папка" className={styles.icon} />;
      case 'file': return <img src={file.isFavorite ? "/assets/file-favorite.png" : "/assets/files.png"} alt="Файл" className={styles.icon} />;
      case 'link': return <img src={"/assets/links.png"} alt="Ссылка" className={styles.icon} />;
      default: return '📄';
    }
  };

  return (
    <div className={isDeleted ? styles.fileItemTrash : styles.fileItem}>
      <div className={styles.name}>
        <span className={styles.iconWrapper}>{getIcon()}</span>
        <div className={styles.nameWrapper}>
        </div>
        <span className={styles.text}>{name}</span>

      </div>

      {isDeleted && (
        <button 
          className={styles.restoreButton} 
          title="Восстановить"
          onClick={(e) => {
            e.stopPropagation();
            handleTrash();
          }}
        >
          <div className={styles.ImageContainer}>
            <img
              src="/assets/backup.png"
              alt="Восстановить"
              className={styles.iconDes}
            />
          </div>
          <span>Восстановить</span>
        </button>
      )}

      <div className={styles.size}>
        <span className={styles.text}>{formattedSize}</span>
      </div>

      <div
        className={styles.menuWrapper}
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuVisible(!isMenuVisible);
        }}
      >
        <div className={styles.menu}>
          <img
            src="/assets/more.png"
            alt="Меню"
            className={styles.menuImage}
          />
        </div>

        <ContextMenu
          isVisible={isMenuVisible}
          menuItems={getMenuItems()}
          className={styles.leftPositionedMenu}
        />
      </div>
    </div>
  );
};

export default FileItem;
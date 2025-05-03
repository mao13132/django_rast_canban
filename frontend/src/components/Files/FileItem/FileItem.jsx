import React from 'react';
import { useFileSize } from '../../../hooks/useFileSize';
import ContextMenu from '../../FileControls/ContextMenu/ContextMenu';
import { useFileItemMenu } from './useFileItemMenu';
import styles from './FileItem.module.css';

const FileItem = ({ file }) => {
  const { name, type, size, isDeleted } = file;
  const formattedSize = useFileSize(size);
  const { isMenuVisible, setIsMenuVisible, getMenuItems } = useFileItemMenu(file);

  const getIcon = () => {
    switch (type) {
      case 'folder': return '📁';
      case 'file': return '📄';
      case 'link': return '🔗';
      default: return '📄';
    }
  };

  return (
    <div className={styles.fileItem}>
      <div className={styles.name}>
        <span className={styles.icon}>{getIcon()}</span>
        <span className={styles.text}>{name}</span>
      </div>

      <div className={styles.size}>
        <span className={styles.text}>{formattedSize}</span>
        {isDeleted && (
          <button className={styles.restoreButton} title="Восстановить">
            🔄
          </button>
        )}
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
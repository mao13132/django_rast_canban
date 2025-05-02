import React from 'react';
import styles from './FileList.module.css';
import FileItem from '../FileItem';
import { useFolderStore } from '../../../store/folderStore';

const FileList = ({ type = 'all' }) => {
  const { folders, isLoading, error } = useFolderStore();

  const filteredFolders = folders.filter(folder => {
    switch (type) {
      case 'favorite':
        return folder.is_favorite;
      case 'trash':
        return folder.is_trashed;
      default:
        return !folder.is_trashed;
    }
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.fileList}>
      <div className={styles.headers}>
        <span className={styles.header}>Название</span>
        <span className={styles.header}>Тип</span>
        <span className={styles.header}>Размер</span>
      </div>
      <div className={styles.items}>
        {filteredFolders.map(folder => (
          <FileItem 
            key={folder.id} 
            file={{
              id: folder.id,
              name: folder.name,
              type: 'folder',
              size: folder.size || '—',
              isFavorite: folder.is_favorite,
              isDeleted: folder.is_trashed
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default FileList;
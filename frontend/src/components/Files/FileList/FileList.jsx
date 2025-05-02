import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FileList.module.css';
import FileItem from '../FileItem';
import { useFolderStore } from '../../../store/folderStore';
import { useFileStore } from '../../../store/fileStore';

const FileList = ({ type = 'all' }) => {
  const { folders, isLoading: foldersLoading, error: foldersError } = useFolderStore();
  const { files, isLoading: filesLoading, error: filesError } = useFileStore();
  const navigate = useNavigate();

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

  const filteredFiles = files.filter(file => {
    switch (type) {
      case 'favorite':
        return file.is_favorite;
      case 'trash':
        return file.is_trashed;
      default:
        return !file.is_trashed;
    }
  });

  const isLoading = foldersLoading || filesLoading;
  const error = foldersError || filesError;

  const handleFileClick = (fileId) => {
    // TODO: Добавить обработку клика по файлу
    console.log('File clicked:', fileId);
  };

  const handleFolderClick = (folderId) => {
    navigate(`/files/folder/${folderId}`);
  };

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
          <div key={`folder-${folder.id}`} onClick={() => handleFolderClick(folder.id)}>
            <FileItem 
              file={{
                id: folder.id,
                name: folder.name,
                type: 'folder',
                size: folder.size || '—',
                isFavorite: folder.is_favorite,
                isDeleted: folder.is_trashed
              }} 
            />
          </div>
        ))}
        {filteredFiles.map(file => (
          <div key={`file-${file.id}`} onClick={() => handleFileClick(file.id)}>
            <FileItem 
              file={{
                id: file.id,
                name: file.name,
                type: file.type || 'file',
                size: file.size || '—',
                isFavorite: file.is_favorite,
                isDeleted: file.is_trashed
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
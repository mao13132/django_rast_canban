import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './FileList.module.css';
import FileItem from '../FileItem';
import { useFolderStore } from '../../../store/folderStore';
import { useFileStore } from '../../../store/fileStore';
import { useLinkStore } from '../../../store/linkStore';

const FileList = ({ type = 'all', searchQuery = '' }) => {
  const { folders, isLoading: foldersLoading, error: foldersError } = useFolderStore();
  const { files, isLoading: filesLoading, error: filesError } = useFileStore();
  const { links, isLoading: linksLoading, error: linksError } = useLinkStore();
  const navigate = useNavigate();
  const { folderId } = useParams();

  const filteredFolders = folders.filter(folder => {
    // Сначала фильтруем по типу
    const typeFilter = type === 'favorite' ? folder.is_favorite :
      type === 'trash' ? folder.is_trashed :
        !folder.is_trashed;

    // Затем фильтруем по поисковому запросу
    const searchFilter = !searchQuery ||
      folder.name.toLowerCase().includes(searchQuery.toLowerCase());

    return typeFilter && searchFilter;
  });

  const filteredFiles = files.filter(file => {
    // Сначала фильтруем по типу
    const typeFilter = type === 'favorite' ? file.is_favorite :
      type === 'trash' ? file.is_trashed :
        !file.is_trashed;

    // Затем фильтруем по поисковому запросу
    const searchFilter = !searchQuery ||
      file.name.toLowerCase().includes(searchQuery.toLowerCase());

    return typeFilter && searchFilter;
  });

  const filteredLinks = !folderId && links ? links.filter(link => {
    // Сначала фильтруем по типу, аналогично файлам и папкам
    const typeFilter = type === 'favorite' ? link.is_favorite :
      type === 'trash' ? link.is_trashed :
        !link.is_trashed;

    // Проверяем наличие name и url перед фильтрацией
    const searchFilter = !searchQuery || 
      (link.name && link.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (link.url && link.url.toLowerCase().includes(searchQuery.toLowerCase()));

    return typeFilter && searchFilter;
  }) : [];

  const isLoading = foldersLoading || filesLoading || linksLoading;
  const error = foldersError || filesError || linksError;

  const handleFileClick = (fileId) => {
    // TODO: Добавить обработку клика по файлу
    console.log('File clicked:', fileId);
  };

  const handleFolderClick = (folderId) => {
    navigate(`/files/folder/${folderId}`);
  };

  const handleLinkClick = (url) => {
    const confirmOpen = window.confirm('Вы уверены, что хотите открыть ссылку?');
    if (confirmOpen) {
      window.open(url, '_blank');
    }
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
        {!folderId && filteredLinks.map(link => (
          <div key={`link-${link.id}`} onClick={() => handleLinkClick(link.url)}>
            <FileItem
              file={{
                id: link.id,
                name: link.name || link.url, // Используем name, если есть, иначе url
                type: 'link',
                size: '—',
                isFavorite: link.is_favorite,
                isDeleted: link.is_trashed
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFolderStore } from '../../store/folderStore';
import styles from './Files.module.css';
import Header from '../../components/Header';
import FileControls from '../../components/FileControls/FileControls';
import SearchBar from '../../components/UI/SearchBar';
import SubHeader from '../../components/SubHeader/SubHeader';
import FileList from '../../components/Files/FileList';
import StorageInfo from '../../components/Files/StorageInfo';

const Files = ({ title = "Все файлы", type = "all" }) => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const { 
    folders,
    breadcrumbs,
    fetchFolders,
    isLoading,
    error 
  } = useFolderStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFolders(folderId);
  }, [folderId]);

  const handleFolderClick = (folder) => {
    navigate(`/files/folder/${folder.folder_id}`);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Header
          navigationLinks={[
            { label: 'Главная страница', path: '/' },
            { label: 'Доска задач', path: '/dashboard' }
          ]}
        />
 
        <div className={styles.contentWrapper}>
          <SubHeader
            title={title}
            navLinks={[
              { label: 'Избранное', path: '/files/favorite' },
              { label: 'Корзина', path: '/files/trash' }
            ]}
            rightComponent={<FileControls />}
          />

          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Поиск заметок'
          />

          <FileList type={type} />
          <StorageInfo />
        </div>
        
        <div className={styles.breadcrumbs}>
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.id}>
              <span 
                className={styles.breadcrumbLink}
                onClick={() => navigate(
                  crumb.id ? `/files/folder/${crumb.id}` : '/files'
                )}
              >
                {crumb.name}
              </span>
              {index < breadcrumbs.length - 1 && ' / '}
            </span>
          ))}
        </div>

        {isLoading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div>Ошибка: {error}</div>
        ) : (
          <div className={styles.folderGrid}>
            {folders.map(folder => (
              <div
                key={folder.folder_id}
                className={styles.folderItem}
                onClick={() => handleFolderClick(folder)}
              >
                <img src="/assets/folder.png" alt="Папка" />
                <span>{folder.name}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Files;
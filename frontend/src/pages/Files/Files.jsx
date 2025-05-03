import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFolderStore } from '../../store/folderStore';
import { useFileStore } from '../../store/fileStore';
import styles from './Files.module.css';
import Header from '../../components/Header';
import FileControls from '../../components/FileControls/FileControls';
import SearchBar from '../../components/UI/SearchBar';
import { useLinkStore } from '../../store/linkStore';
import SubHeader from '../../components/SubHeader/SubHeader';
import FileList from '../../components/Files/FileList';
import StorageInfo from '../../components/Files/StorageInfo';

const Files = ({ title = "Все файлы", type = "all" }) => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const {
    fetchFolders,
  } = useFolderStore();
  const { fetchLinks } = useLinkStore()
  const {
    fetchFiles,
  } = useFileStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFolders(folderId || null);
    fetchFiles(folderId || null);
    fetchLinks();

    // Добавляем слушатель события загрузки папки
    const handleFolderUploaded = () => {
      fetchFolders(folderId || null);
      fetchFiles(folderId || null);
    };

    window.addEventListener('folderUploaded', handleFolderUploaded);

    // Очищаем слушатель при размонтировании
    return () => {
      window.removeEventListener('folderUploaded', handleFolderUploaded);
    };
  }, [folderId, fetchFolders, fetchFiles, fetchLinks]);

  const handleBack = () => {
    navigate(-1);
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
            placeholder='Поиск файлов и папок'
          />

          {folderId && (
            <button
              className={styles.backButton}
              onClick={handleBack}
            >
              ← Назад
            </button>
          )}

          <FileList type={type} searchQuery={searchQuery} />
          <StorageInfo />
        </div>
      </main>
    </div>
  );
};

export default Files;
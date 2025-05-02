import React, { useState } from 'react';
import styles from './Files.module.css';
import Header from '../../components/Header';
import FileControls from '../../components/FileControls/FileControls';
import SearchBar from '../../components/UI/SearchBar';
import SubHeader from '../../components/SubHeader/SubHeader';
import FileList from '../../components/Files/FileList';
import StorageInfo from '../../components/Files/StorageInfo';

const Files = ({ title = "Все файлы", type = "all" }) => {
  const [searchQuery, setSearchQuery] = useState('');

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
      </main>

    </div>
  );
};

export default Files; 
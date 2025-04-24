import React from 'react';
import styles from './Files.module.css';
import Header from '../../components/Header';
import FileSearch from '../../components/Files/FileSearch';
import FileNavigation from '../../components/Files/FileNavigation';
import FileList from '../../components/Files/FileList';
import StorageInfo from '../../components/Files/StorageInfo';

const Files = ({ title = "Все файлы", type = "all" }) => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <FileNavigation currentType={type} />
        </div>
        <FileSearch />
        <FileList type={type} />
        <StorageInfo />
      </main>
    </div>
  );
};

export default Files; 
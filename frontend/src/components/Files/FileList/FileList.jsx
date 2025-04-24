import React from 'react';
import styles from './FileList.module.css';
import FileItem from '../FileItem';

const FileList = ({ type = 'all' }) => {
  const files = [
    { id: 1, name: 'Учеба', type: 'folder', size: '15 КБ', isFavorite: true },
    { id: 2, name: 'Работа', type: 'folder', size: '176 КБ', isFavorite: false },
    { id: 3, name: 'Отчет.doc', type: 'file', size: '17 КБ', isFavorite: true },
    { id: 4, name: 'Фото.jpg', type: 'file', size: '10 КБ', isFavorite: false },
    { id: 5, name: 'Презентация.pptx', type: 'file', size: '6 КБ', isFavorite: true },
    { id: 6, name: 'Клип.mp4', type: 'file', size: '1 ГБ', isFavorite: false },
    { id: 7, name: 'Google Keep', type: 'link', size: '6 КБ', isFavorite: true },
  ];

  const filteredFiles = files.filter(file => {
    switch (type) {
      case 'favorite':
        return file.isFavorite;
      case 'trash':
        return file.isDeleted;
      default:
        return true;
    }
  });

  return (
    <div className={styles.fileList}>
      <div className={styles.headers}>
        <span className={styles.header}>Папки</span>
        <span className={styles.header}>Файлы</span>
        <span className={styles.header}>Размер</span>
      </div>
      <div className={styles.items}>
        {filteredFiles.map(file => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
};

export default FileList; 
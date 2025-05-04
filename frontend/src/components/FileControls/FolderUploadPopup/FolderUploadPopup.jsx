import React, { useRef } from 'react';
import { useFolderUpload } from '../../../context/FolderUploadContext';
import { useFolderUploadStore } from '../../../store/folderUploadStore';
import { useNotification } from '../../../context/NotificationContext';
import styles from './FolderUploadPopup.module.css';

const FolderUploadPopup = () => {
    const { isOpen, closePopup, currentFolderId } = useFolderUpload();
    const { uploadFolderWithFiles, isUploading, progress } = useFolderUploadStore();
    const { showNotification } = useNotification();
    const folderInputRef = useRef(null);

    const handleFolderSelect = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        try {
            await uploadFolderWithFiles(files, currentFolderId);
            showNotification('Папка успешно загружена', 'success', 3000, 'bottom');
            closePopup();
        } catch (error) {
            showNotification('Ошибка при загрузке папки', 'error', 3000, 'bottom');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h2>Загрузить папку с файлами</h2>
                    <button className={styles.closeButton} onClick={closePopup}>×</button>
                </div>
                <div className={styles.formGroup}>
                    <input
                        type="file"
                        ref={folderInputRef}
                        onChange={handleFolderSelect}
                        webkitdirectory=""
                        directory=""
                        style={{ display: 'none' }}
                    />
                    <div className={styles.dropzone} onClick={() => folderInputRef.current?.click()}>
                        {isUploading ? (
                            <div className={styles.progress}>
                                <div 
                                    className={styles.progressBar} 
                                    style={{ width: `${progress}%` }}
                                />
                                <span>Идёт загрузка...</span>
                            </div>
                        ) : (
                            'Нажмите для выбора папки'
                        )}
                    </div>
                </div>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={closePopup}
                        disabled={isUploading}
                    >
                        Отменить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FolderUploadPopup;
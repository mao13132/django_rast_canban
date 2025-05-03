import React, { useRef } from 'react';
import { useFilePopup } from '../../../context/FilePopupContext';
import { useFolderStore } from '../../../store/folderStore';
import { useNotification } from '../../../context/NotificationContext';
import styles from './FolderPopup.module.css';

const FolderPopup = () => {
    const { isOpen, closePopup, currentFolderId } = useFilePopup();
    const { uploadFolder } = useFolderStore();
    const { showNotification } = useNotification();
    const folderInputRef = useRef(null);

    const handleFolderChange = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        try {
            await uploadFolder(files, currentFolderId);
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
                    <h2>Загрузить папку</h2>
                    <button className={styles.closeButton} onClick={closePopup}>×</button>
                </div>
                <div className={styles.formGroup}>
                    <input
                        type="file"
                        ref={folderInputRef}
                        onChange={handleFolderChange}
                        style={{ display: 'none' }}
                        webkitdirectory="true"
                        directory="true"
                        multiple
                    />
                    <div 
                        className={styles.dropzone}
                        onClick={() => folderInputRef.current?.click()}
                    >
                        Выберите папку для загрузки
                    </div>
                </div>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={closePopup}
                    >
                        Отменить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FolderPopup;
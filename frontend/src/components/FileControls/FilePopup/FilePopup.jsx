import React, { useRef } from 'react';
import { useFilePopup } from '../../../context/FilePopupContext';
import { useFileStore } from '../../../store/fileStore';
import { useNotification } from '../../../context/NotificationContext';
import styles from './FilePopup.module.css';

const FilePopup = () => {
    const { isOpen, closePopup, currentFolderId } = useFilePopup();
    const { uploadFile } = useFileStore();
    const { showNotification } = useNotification();
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            await uploadFile(file, currentFolderId);
            showNotification('Файл успешно загружен', 'success', 3000, 'bottom');
            closePopup();
        } catch (error) {
            showNotification('Ошибка при загрузке файла', 'error', 3000, 'bottom');
        }
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (!file) return;

        try {
            await uploadFile(file, currentFolderId);
            showNotification('Файл успешно загружен', 'success', 3000, 'bottom');
            closePopup();
        } catch (error) {
            showNotification('Ошибка при загрузке файла', 'error', 3000, 'bottom');
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div 
                className={styles.popup}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <div className={styles.header}>
                    <h2>Загрузить файл</h2>
                    <button className={styles.closeButton} onClick={closePopup}>×</button>
                </div>
                <div className={styles.formGroup}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <div 
                        className={styles.dropzone}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Перетащите файл сюда или кликните для выбора
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

export default FilePopup;
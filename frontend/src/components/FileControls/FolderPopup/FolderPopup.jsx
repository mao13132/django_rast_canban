import React, { useState } from 'react';
import { useFolderPopup } from '../../../context/FolderPopupContext';
import { useFolderStore } from '../../../stores/folderStore';
import { useNotification } from '../../../context/NotificationContext';
import styles from './FolderPopup.module.css';

const FolderPopup = () => {
    const { isOpen, closePopup, currentFolderId } = useFolderPopup();
    const { createFolder } = useFolderStore();
    const { showNotification } = useNotification();
    const [name, setName] = useState('');

    const handleSubmit = async () => {
        try {
            await createFolder({ name, parent_id: currentFolderId });
            showNotification('Папка успешно создана', 'success', 3000, 'bottom');
            closePopup();
            setName('');
        } catch (error) {
            showNotification('Ошибка при создании папки', 'error', 3000, 'bottom');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h2>Создать папку</h2>
                    <button className={styles.closeButton} onClick={closePopup}>×</button>
                </div>
                <div className={styles.formGroup}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Название папки"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={handleSubmit}
                        disabled={!name}
                    >
                        Сохранить
                    </button>
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
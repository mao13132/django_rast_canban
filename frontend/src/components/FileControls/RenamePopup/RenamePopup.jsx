import React, { useState, useEffect } from 'react';
import { useRenamePopup } from '../../../context/RenamePopupContext';
import { useFolderStore } from '../../../store/folderStore';
import { useFileStore } from '../../../store/fileStore';
import { useNotification } from '../../../context/NotificationContext';
import styles from '../FolderPopup/FolderPopup.module.css';

const RenamePopup = () => {
    const { isOpen, closePopup, itemData } = useRenamePopup();
    const { renameFolder } = useFolderStore();
    const { renameFile } = useFileStore();
    const { showNotification } = useNotification();
    const [name, setName] = useState('');

    useEffect(() => {
        if (itemData) {
            setName(itemData.name || '');
        }
    }, [itemData]);

    const handleSubmit = async () => {
        try {
            if (!itemData) return;

            if (itemData.type === 'folder') {
                await renameFolder(itemData.id, name);
            } else if (itemData.type === 'file') {
                await renameFile(itemData.id, name);
            }

            showNotification('Успешно переименовано', 'success', 3000, 'bottom');
            closePopup();
            setName('');
        } catch (error) {
            showNotification('Ошибка при переименовании', 'error', 3000, 'bottom');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h2>Переименовать {itemData?.type === 'folder' ? 'папку' : 'файл'}</h2>
                    <button className={styles.closeButton} onClick={closePopup}>×</button>
                </div>
                <div className={styles.formGroup}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Введите новое название"
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

export default RenamePopup;
import React, { useState } from 'react';
import { useLinkPopup } from '../../../context/LinkPopupContext';
import { useNotification } from '../../../context/NotificationContext';
import styles from './LinkPopup.module.css';

const LinkPopup = () => {
    const { isOpen, closePopup, currentFolderId } = useLinkPopup();
    const { showNotification } = useNotification();
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = async () => {
        try {
            // TODO: Добавить логику создания ссылки
            showNotification('Ссылка успешно создана', 'success', 3000, 'bottom');
            closePopup();
            setName('');
            setUrl('');
        } catch (error) {
            showNotification('Ошибка при создании ссылки', 'error', 3000, 'bottom');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.header}>
                    <h2>Создать ссылку</h2>
                    <button className={styles.closeButton} onClick={closePopup}>×</button>
                </div>
                <div className={styles.formGroup}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Название ссылки"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <input
                        type="url"
                        className={styles.input}
                        placeholder="URL ссылки"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={handleSubmit}
                        disabled={!name || !url}
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

export default LinkPopup;
import React, { useState } from 'react';
import { useLinkPopup } from '../../../context/LinkPopupContext';
import { useNotification } from '../../../context/NotificationContext';
import { useLinkStore } from '../../../store/linkStore';
import styles from './LinkPopup.module.css';

const LinkPopup = () => {
    const { isOpen, closePopup, currentFolderId } = useLinkPopup();
    const { showNotification } = useNotification();
    const { createLink, isLoading } = useLinkStore();
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = async () => {
        if (!url) {
            showNotification('URL обязателен', 'error', 3000, 'bottom');
            return;
        }

        try {
            await createLink({
                url,
                name,
                is_favorite: false,
                is_trashed: false
            });
            
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
                        required
                    />
                </div>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={handleSubmit}
                        disabled={!url || isLoading}
                    >
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={closePopup}
                        disabled={isLoading}
                    >
                        Отменить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LinkPopup;
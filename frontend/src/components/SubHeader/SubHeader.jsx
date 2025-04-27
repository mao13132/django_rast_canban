import React from 'react';
import styles from './SubHeader.module.css';

import { useNavigate } from 'react-router-dom';

/**
 * Универсальный компонент подзаголовка
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок
 * @param {Array<{label: string, href: string, isActive?: boolean}>} props.navLinks - Массив навигационных ссылок
 * @param {React.ReactNode} props.rightComponent - Компонент для отображения справа
 */
const SubHeader = ({ title, navLinks = [], rightComponent }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.subHeader}>
                <div className={styles.left}>
                    <h1 className={styles.title}>{title}</h1>
                    {navLinks.length > 0 && (
                        <div className={styles.navLinks}>
                            {navLinks.map((link, index) => (
                                <span key={index} className={`${styles.navLink} ${link.isActive ? styles.active : ''}`} onClick={() => navigate(link.path)} >{link.label}</span>
                            ))}
                        </div>
                    )}
                </div>

                {rightComponent && (
                    <div className={styles.right}>
                        {rightComponent}
                    </div>
                )}
            </div>

            <div className={styles.divider}></div>

        </div>
    );
};

export default SubHeader; 
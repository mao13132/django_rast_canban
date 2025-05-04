import React from 'react';
import styles from './ContextMenu.module.css';

/**
 * Универсальный компонент контекстного меню
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.isVisible - Флаг видимости меню
 * @param {Array<{label: string, onClick: Function, icon?: string}>} props.menuItems - Массив пунктов меню
 */
const ContextMenu = ({ isVisible, menuItems, className = '' }) => {
  if (!isVisible) return null;

  return (
    <div className={`${styles.menu} ${className}`}>
      {menuItems.map((item, index) => (
        <button
          key={index}
          className={styles.menuItem}
          onClick={item.onClick}
        >
          {item.icon && (
            <div className={styles.wrapperImg}>
              <img
                src={item.icon}
                alt={item.label}
                className={styles.menuIcon}
              />
            </div>
          )}
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
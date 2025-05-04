import { useState } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { useFolderStore } from '../../../store/folderStore';

/**
 * Хук для управления контекстным меню элемента файловой системы
 * @param {Object} file - Объект файла/папки/ссылки
 * @param {string} file.type - Тип элемента ('file', 'folder', 'link')
 * @param {boolean} file.isFavorite - Флаг избранного
 * @returns {Object} Объект с методами и данными для управления меню
 */
export const useFileItemMenu = (file) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { showNotification } = useNotification();
  const { toggleFavorite } = useFolderStore();

  const handleAction = (action) => {
    setIsMenuVisible(false);
    action();
  };

  const handleToggleFavorite = async (folderId) => {
    try {
      await toggleFavorite(folderId);
      showNotification(
        file.isFavorite ? 'Удалено из избранного' : 'Добавлено в избранное',
        'success',
        3000,
        'bottom'
      );
    } catch (error) {
      console.error('Ошибка при изменении статуса избранного:', error);
      showNotification(
        'Ошибка при изменении статуса избранного',
        'error',
        3000,
        'bottom'
      );
    }
  };

  const menuItems = {
    folder: [
      {
        label: file.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное',
        onClick: () => handleAction(() => handleToggleFavorite(file.id)),
        icon: file.isFavorite ? '/assets/star-filled.png' : '/assets/star.png'
      },
      {
        label: 'Переименовать',
        onClick: () => handleAction(() => console.log('Rename')),
        icon: '/assets/rename.png'
      },
      {
        label: 'Копировать',
        onClick: () => handleAction(() => console.log('Copy')),
        icon: '/assets/copy.png'
      },
      {
        label: 'Скачать',
        onClick: () => handleAction(() => console.log('Download')),
        icon: '/assets/download.png'
      },
      {
        label: 'Отправить в корзину',
        onClick: () => handleAction(() => console.log('Delete')),
        icon: '/assets/trash.png'
      }
    ],
    link: [
      {
        label: file.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное',
        onClick: () => handleAction(() => console.log('Toggle favorite')),
        icon: file.isFavorite ? '/assets/star-filled.png' : '/assets/star.png'
      },
      {
        label: 'Копировать',
        onClick: () => handleAction(() => console.log('Copy')),
        icon: '/assets/copy.png'
      },
      {
        label: 'Открыть',
        onClick: () => handleAction(() => console.log('Open')),
        icon: '/assets/open.png'
      },
      {
        label: 'Отправить в корзину',
        onClick: () => handleAction(() => console.log('Delete')),
        icon: '/assets/trash.png'
      }
    ]
  };

  // Файлы используют те же опции, что и папки
  menuItems.file = menuItems.folder;

  return {
    isMenuVisible,
    setIsMenuVisible,
    getMenuItems: () => menuItems[file.type] || []
  };
};
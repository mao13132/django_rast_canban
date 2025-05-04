import { useState } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { useFolderStore } from '../../../store/folderStore';
import { useFileStore } from '../../../store/fileStore';
import { useRenamePopup } from '../../../context/RenamePopupContext';

export const useFileItemMenu = (file) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { showNotification } = useNotification();
  const { toggleFavorite: toggleFolderFavorite, toggleTrash: toggleFolderTrash } = useFolderStore();
  const { toggleFavorite: toggleFileFavorite, toggleTrash: toggleFileTrash } = useFileStore();

  const handleAction = (action) => {
    setIsMenuVisible(false);
    action();
  };

  const handleToggleFavorite = async () => {
    try {
      if (file.type === 'folder') {
        await toggleFolderFavorite(file.id);
      } else if (file.type === 'file') {
        await toggleFileFavorite(file.id);
      }

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

  const handleTrash = async () => {
    try {
      if (file.type === 'folder') {
        await toggleFolderTrash(file.id);
      } else if (file.type === 'file') {
        await toggleFileTrash(file.id);
      }

      showNotification(
        file.isDeleted ? 'Элемент восстановлен' : 'Элемент перемещен в корзину',
        'success',
        3000,
        'bottom'
      );
    } catch (error) {
      console.error('Ошибка при изменении статуса корзины:', error);
      showNotification(
        'Ошибка при изменении статуса корзины',
        'error',
        3000,
        'bottom'
      );
    }
  };

  const { openPopup: openRenamePopup } = useRenamePopup();

  const handleRename = () => {
      openRenamePopup({
          id: file.id,
          type: file.type,
          name: file.name
      });
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
        onClick: () => handleAction(() => handleRename()),
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
        label: file.isDeleted ? 'Восстановить' : 'Отправить в корзину',
        onClick: () => handleAction(() => handleTrash()),
        icon: file.isDeleted ? '/assets/restore.png' : '/assets/trash.png'
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
        onClick: null,
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
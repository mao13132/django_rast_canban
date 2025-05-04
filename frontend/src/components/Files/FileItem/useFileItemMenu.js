import { useState } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { useFolderStore } from '../../../store/folderStore';
import { useFileStore } from '../../../store/fileStore';
import { useLinkStore } from '../../../store/linkStore';
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

  const { downloadFile } = useFileStore();
  const { downloadFolder } = useFolderStore();

  const handleDownload = async (e) => {
    try {
      // Предотвращаем закрытие меню при скачивании
      e.stopPropagation();

      if (file.type === 'folder') {
        await downloadFolder(file.id, file.name);
      } else if (file.type === 'file') {
        await downloadFile(file.id);
      }

      showNotification(
        'Скачивание началось',
        'success',
        3000,
        'bottom'
      );
    } catch (error) {
      console.error('Ошибка при скачивании:', error);
      showNotification(
        `Ошибка при скачивании ${file.type === 'folder' ? 'папки' : 'файла'}`,
        'error',
        3000,
        'bottom'
      );
    }
  };

  const { copyLink, openLink, deleteLink } = useLinkStore();

  const handleCopyLink = async () => {
      try {
          await copyLink(file.name);
          showNotification(
              'Ссылка скопирована в буфер обмена',
              'success',
              3000,
              'bottom'
          );
      } catch (error) {
          console.error('Ошибка при копировании ссылки:', error);
          showNotification(
              'Ошибка при копировании ссылки',
              'error',
              3000,
              'bottom'
          );
      }
  };

  const handleOpen = async () => {
      try {
          const confirmed = window.confirm(`Открыть ссылку "${file.name}"?`);
          
          if (confirmed) {
              await openLink(file.name);
              showNotification(
                  'Ссылка открыта в новой вкладке',
                  'success',
                  3000,
                  'bottom'
              );
          }
      } catch (error) {
          console.error('Ошибка при открытии ссылки:', error);
          showNotification(
              'Ошибка при открытии ссылки',
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
        onClick: () => handleAction(() => handleRename()),
        icon: '/assets/rename.png'
      },
      {
        label: 'Скачать',
        onClick: (e) => handleDownload(e), // Передаем событие
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
        onClick: () => handleAction(() => handleCopyLink()),
        icon: '/assets/copy.png'
      },
      {
        label: 'Открыть',
        onClick: () => handleAction(() => handleOpen()),
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
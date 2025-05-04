import { create } from 'zustand';
import { foldersAPI } from '../services/api';
import * as FolderDTO from '../dto/FolderDTO';

export const useFolderStore = create((set, get) => ({
  // Состояние
  currentFolder: null,
  folders: [],
  isLoading: false,
  error: null,

  // Действия
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Загрузка папок для текущей директории
  fetchFolders: async (parentId = null) => {
    try {
      const response = await foldersAPI.getFolders(parentId);
      const normalizedFolders = response.data.map(FolderDTO.fromBackend);
      
      set({ 
        folders: normalizedFolders,
        currentFolder: parentId,
        error: null
      });
    } catch (err) {
      console.error('Ошибка при загрузке папок:', err);
      set({ error: 'Ошибка при загрузке папок', folders: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  // Создание новой папки
  createFolder: async (name) => {
    const { currentFolder } = get();
    try {
      set({ isLoading: true });
      const folderData = FolderDTO.toBackend({ 
        name: name,
        parent_id: currentFolder,
        is_favorite: false,
        is_trashed: false
      });
      const response = await foldersAPI.createFolder(folderData);
      const newFolder = FolderDTO.fromBackend(response.data);
      
      set(state => ({
        folders: [...state.folders, newFolder],
        error: null
      }));
      return newFolder;
    } catch (err) {
      console.error('Ошибка при создании папки:', err);
      set({ error: 'Ошибка при создании папки' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  // Переключение избранного статуса папки
  toggleFavorite: async (folderId) => {
    try {
      set({ isLoading: true });
      const response = await foldersAPI.toggleFolderFavorite(folderId);
      const updatedFolder = FolderDTO.fromBackend(response.data);
      
      set(state => ({
        folders: state.folders.map(folder =>
          folder.id === folderId ? updatedFolder : folder
        ),
        error: null
      }));
      return updatedFolder;
    } catch (err) {
      console.error('Ошибка при обновлении статуса избранного:', err);
      set({ error: 'Ошибка при обновлении статуса избранного' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
    
    toggleTrash: async (folderId) => {
        try {
            set({ isLoading: true });
            const response = await foldersAPI.toggleTrash(folderId);
            const updatedFolder = FolderDTO.fromBackend(response.data);
            
            set(state => ({
                folders: state.folders.map(folder =>
                    folder.id === folderId ? updatedFolder : folder
                ),
                error: null
            }));
            return updatedFolder;
        } catch (err) {
            console.error('Ошибка при изменении статуса корзины:', err);
            set({ error: 'Ошибка при изменении статуса корзины' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },
    
    deleteFolder: async (folderId) => {
        try {
            set({ isLoading: true });
            await foldersAPI.deleteFolder(folderId);
            
            set(state => ({
                folders: state.folders.filter(folder => folder.id !== folderId),
                error: null
            }));
        } catch (err) {
            console.error('Ошибка при удалении папки:', err);
            set({ error: 'Ошибка при удалении папки' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },
    
    renameFolder: async (folderId, newName) => {
        try {
            set({ isLoading: true });
            const response = await foldersAPI.updateFolder(folderId, { name: newName });
            const updatedFolder = FolderDTO.fromBackend(response.data);
            
            set(state => ({
                folders: state.folders.map(folder =>
                    folder.id === folderId ? updatedFolder : folder
                ),
                error: null
            }));
            return updatedFolder;
        } catch (err) {
            console.error('Ошибка при переименовании папки:', err);
            set({ error: 'Ошибка при переименовании папки' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },
  downloadFolder: async (folderId, fileName) => {
    try {
      set({ isLoading: true });
      const response = await foldersAPI.downloadFolder(folderId);
      
      // Создаем ссылку для скачивания
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      set({ error: null });
      return true;
    } catch (err) {
      console.error('Ошибка при скачивании папки:', err);
      set({ error: 'Ошибка при скачивании папки' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
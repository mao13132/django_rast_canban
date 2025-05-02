import { create } from 'zustand';
import { foldersAPI } from '../services/api';
import * as FolderDTO from '../dto/FolderDTO';

export const useFolderStore = create((set, get) => ({
  // Состояние
  currentFolder: null,
  folders: [],
  breadcrumbs: [],
  isLoading: false,
  error: null,

  // Действия
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Загрузка папок для текущей директории
  fetchFolders: async (parentId = null) => {
    try {
      set({ isLoading: true });
      const response = await foldersAPI.getFolders(parentId);
      const normalizedFolders = response.data.map(FolderDTO.fromBackend);
      set({ 
        folders: normalizedFolders,
        currentFolder: parentId,
        error: null
      });
      await get().updateBreadcrumbs(parentId);
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
        name: name, // Исправляем передачу имени
        parent_id: currentFolder,
        is_favorite: false,
        is_trashed: false
      });
      debugger
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

  // Обновление хлебных крошек
  updateBreadcrumbs: async (folderId) => {
    if (!folderId) {
      set({ breadcrumbs: [] });
      return;
    }

    try {
      set({ isLoading: true });
      const response = await foldersAPI.getFolder(folderId);
      const folder = FolderDTO.fromBackend(response.data);
      const path = folder.get_full_path.split('/');
      
      const breadcrumbs = await Promise.all(
        path.map(async (name, index) => {
          if (index === 0) {
            return { id: null, name: 'Главная' };
          }
          const folderResponse = await foldersAPI.getFolderByName(name);
          const folderData = FolderDTO.fromBackend(folderResponse.data[0]);
          return {
            id: folderData.id,
            name: folderData.name
          };
        })
      );
      
      set({ breadcrumbs, error: null });
    } catch (err) {
      console.error('Ошибка при обновлении пути:', err);
      set({ error: 'Ошибка при обновлении пути' });
    } finally {
      set({ isLoading: false });
    }
  }
}));
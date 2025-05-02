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
}));
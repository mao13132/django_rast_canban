import { create } from 'zustand';
import axios from 'axios';

const API_URL = '/api/folders';

export const useFolderStore = create((set, get) => ({
  currentFolder: null,
  folders: [],
  breadcrumbs: [],
  isLoading: false,
  error: null,

  // Загрузка папок для текущей директории
  fetchFolders: async (parentId = null) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(API_URL, {
        params: { parent_id: parentId }
      });
      set({ 
        folders: response.data,
        currentFolder: parentId,
        isLoading: false 
      });
      await get().updateBreadcrumbs(parentId);
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Создание новой папки
  createFolder: async (name) => {
    const { currentFolder } = get();
    try {
      const response = await axios.post(API_URL, {
        name,
        parent_id: currentFolder
      });
      set(state => ({
        folders: [...state.folders, response.data]
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Обновление хлебных крошек
  updateBreadcrumbs: async (folderId) => {
    if (!folderId) {
      set({ breadcrumbs: [] });
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/${folderId}`);
      const folder = response.data;
      const path = folder.get_full_path.split('/');
      const breadcrumbs = await Promise.all(
        path.map(async (name, index) => {
          if (index === 0) {
            return { id: null, name: 'Главная' };
          }
          const folderResponse = await axios.get(`${API_URL}?name=${name}`);
          return {
            id: folderResponse.data[0].folder_id,
            name: folderResponse.data[0].name
          };
        })
      );
      set({ breadcrumbs });
    } catch (error) {
      console.error('Ошибка при обновлении пути:', error);
    }
  }
}));
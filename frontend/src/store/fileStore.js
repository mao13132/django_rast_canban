import { create } from 'zustand';
import { filesAPI } from '../services/api';
import * as FileDTO from '../dto/FileDTO';

export const useFileStore = create((set, get) => ({
    // Состояние
    currentFile: null,
    files: [],
    isLoading: false,
    error: null,

    // Действия
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    // Загрузка файлов для текущей директории
    fetchFiles: async (folderId = null) => {
        try {
            set({ isLoading: true });
            const params = folderId === null ? { folder_id__isnull: true } : { folder_id: folderId };
            const response = await filesAPI.getFiles(params);
            const normalizedFiles = response.data.map(FileDTO.fromBackend);

            set({
                files: normalizedFiles,
                error: null
            });
        } catch (err) {
            console.error('Ошибка при загрузке файлов:', err);
            set({ error: 'Ошибка при загрузке файлов', files: [] });
        } finally {
            set({ isLoading: false });
        }
    },

    // Загрузка файла
    uploadFile: async (file, folderId = null) => {
        try {
            set({ isLoading: true });
            const fileData = FileDTO.toBackend({
                name: file.name,
                folder_id: folderId,
                file: file,
                is_favorite: false,
                is_trashed: false
            });
            
            const response = await filesAPI.uploadFile(fileData);
            const newFile = FileDTO.fromBackend(response.data);

            set(state => ({
                files: [...state.files, newFile],
                error: null
            }));
            return newFile;
        } catch (err) {
            console.error('Ошибка при загрузке файла:', err);
            set({ error: 'Ошибка при загрузке файла' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },
    
    toggleFavorite: async (fileId) => {
        try {
            set({ isLoading: true });
            const response = await filesAPI.toggleFileFavorite(fileId);
            const updatedFile = FileDTO.fromBackend(response.data);
            
            set(state => ({
                files: state.files.map(file => 
                    file.id === fileId ? updatedFile : file
                ),
                error: null
            }));
            
            return updatedFile;
        } catch (err) {
            console.error('Ошибка при изменении избранного:', err);
            set({ error: 'Ошибка при изменении избранного' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    }
}));
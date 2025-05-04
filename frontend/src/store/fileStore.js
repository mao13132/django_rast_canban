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
    },
    
    toggleTrash: async (fileId) => {
        try {
            set({ isLoading: true });
            const response = await filesAPI.toggleTrash(fileId);
            const updatedFile = FileDTO.fromBackend(response.data);
            
            set(state => ({
                files: state.files.map(file => 
                    file.id === fileId ? updatedFile : file
                ),
                error: null
            }));
            
            return updatedFile;
        } catch (err) {
            console.error('Ошибка при изменении статуса корзины:', err);
            set({ error: 'Ошибка при изменении статуса корзины' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },
    
    deleteFile: async (fileId) => {
        try {
            set({ isLoading: true });
            await filesAPI.deleteFile(fileId);
            
            set(state => ({
                files: state.files.filter(file => file.id !== fileId),
                error: null
            }));
        } catch (err) {
            console.error('Ошибка при удалении файла:', err);
            set({ error: 'Ошибка при удалении файла' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },
    
    renameFile: async (fileId, newName) => {
        try {
            set({ isLoading: true });
            const response = await filesAPI.updateFile(fileId, { name: newName });
            const updatedFile = FileDTO.fromBackend(response.data);
            
            set(state => ({
                files: state.files.map(file => 
                    file.id === fileId ? updatedFile : file
                ),
                error: null
            }));
            
            return updatedFile;
        } catch (err) {
            console.error('Ошибка при переименовании файла:', err);
            set({ error: 'Ошибка при переименовании файла' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },
    
    downloadFile: async (fileId) => {
        try {
            set({ isLoading: true });
            const response = await filesAPI.downloadFile(fileId);
            
            // Создаем blob из полученных данных
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            
            // Получаем информацию о файле из текущего состояния
            const file = get().files.find(f => f.id === fileId);
            const fileName = file ? file.name : 'downloaded_file';
            
            // Создаем ссылку для скачивания
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            set({ error: null });
        } catch (err) {
            console.error('Ошибка при скачивании файла:', err);
            set({ error: 'Ошибка при скачивании файла' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },
}));
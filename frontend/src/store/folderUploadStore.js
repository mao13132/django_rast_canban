import { create } from 'zustand';
import { folderUploadAPI } from '../services/api';
import * as FolderUploadDTO from '../dto/FolderUploadDTO';

export const useFolderUploadStore = create((set, get) => ({
    isUploading: false,
    progress: 0,
    error: null,

    setUploading: (isUploading) => set({ isUploading }),
    setProgress: (progress) => set({ progress }),
    setError: (error) => set({ error }),

    uploadFolderWithFiles: async (files, parentId = null) => {
        try {
            set({ isUploading: true, progress: 0, error: null });

            // Получаем структуру папки
            const folderPath = files[0].webkitRelativePath;
            const folderName = folderPath.split('/')[0];

            // Создаем структуру файлов
            const filesStructure = Array.from(files).map(file => ({
                name: file.name,
                path: file.webkitRelativePath.split('/').slice(1).join('/'),
                size: file.size,
                type: file.type,
                blob: file // Передаем сам файл как Blob
            }));

            // Формируем данные для отправки
            const uploadData = FolderUploadDTO.toBackend({
                name: folderName,
                parent_id: parentId,
                files: filesStructure
            });

            const response = await folderUploadAPI.uploadFolderWithFiles(uploadData);
            const result = FolderUploadDTO.fromBackend(response.data);

            set({ isUploading: false, progress: 100 });
            return result;
        } catch (err) {
            console.error('Ошибка при загрузке папки:', err);
            set({ error: 'Ошибка при загрузке папки', isUploading: false });
            throw err;
        }
    }
}));
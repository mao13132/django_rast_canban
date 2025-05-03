/**
 * Преобразует данные загрузки папки из фронтенда в формат бэкенда
 * @param {Object} data - Данные папки и файлов с фронтенда
 * @returns {Object} Данные для отправки на бэкенд
 */
export const toBackend = (data) => ({
    name: data.name || '',
    parent_id: data.parent_id || null,
    is_favorite: false,
    is_trashed: false,
    files: data.files || []
});

/**
 * Преобразует данные загрузки папки из бэкенда в формат фронтенда
 * @param {Object} data - Данные с бэкенда
 * @returns {Object} Нормализованные данные
 */
export const fromBackend = (data) => ({
    id: data.folder_id,
    name: data.name,
    parent_id: data.parent_id,
    is_favorite: data.is_favorite,
    is_trashed: data.is_trashed,
    size: data.size,
    files: data.files?.map(file => ({
        id: file.file_id,
        name: file.name,
        size: file.size,
        file_url: file.file
    })) || []
});
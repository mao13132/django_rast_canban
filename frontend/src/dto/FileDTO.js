/**
 * Преобразует данные файла из бэкенда в формат фронтенда
 * @param {Object} data - Данные файла с бэкенда
 * @returns {Object} Нормализованные данные файла
 */
export const fromBackend = (data) => ({
    id: data.file_id,
    name: data.name,
    folder_id: data.folder_id,
    size: data.size,
    is_favorite: data.is_favorite,
    is_trashed: data.is_trashed,
    file_url: data.file
});

/**
 * Преобразует данные файла из фронтенда в формат бэкенда
 * @param {Object} data - Данные файла с фронтенда
 * @returns {FormData} Данные файла для отправки на бэкенд
 */
export const toBackend = (data) => {
    return {
        name: data.name || '',
        folder_id: data.folder_id ? Number(data.folder_id) : null,
        is_favorite: Boolean(data.is_favorite),
        is_trashed: Boolean(data.is_trashed),
        file: data.file || null
    };
};

/**
 * Создает пустую форму файла
 * @returns {Object} Пустая форма файла
 */
export const createEmptyForm = () => ({
    name: '',
    folder_id: null,
    is_favorite: false,
    is_trashed: false,
    file: null
});
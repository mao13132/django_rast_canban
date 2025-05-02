/**
 * Преобразует данные папки из бэкенда в формат фронтенда
 * @param {Object} data - Данные папки с бэкенда
 * @returns {Object} Нормализованные данные папки
 */
export const fromBackend = (data) => ({
    id: data.folder_id,
    name: data.name,
    parent_id: data.parent_id,
    is_favorite: data.is_favorite,
    is_trashed: data.is_trashed,
    size: data.size
});

/**
 * Преобразует данные папки из фронтенда в формат бэкенда
 * @param {Object} data - Данные папки с фронтенда
 * @returns {Object} Данные папки для отправки на бэкенд
 */
export const toBackend = (data) => ({
    name: data.name || '',
    parent_id: data.parent_id || null,
    is_favorite: Boolean(data.is_favorite),
    is_trashed: Boolean(data.is_trashed)
});

/**
 * Создает пустую форму папки
 * @returns {Object} Пустая форма папки
 */
export const createEmptyForm = () => ({
    name: '',
    parent_id: null,
    is_favorite: false,
    is_trashed: false
});
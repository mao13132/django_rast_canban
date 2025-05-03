/**
 * Преобразует данные ссылки из бэкенда в формат фронтенда
 * @param {Object} data - Данные ссылки с бэкенда
 * @returns {Object} Нормализованные данные ссылки
 */
export const fromBackend = (data) => ({
    id: data.link_id,
    url: data.url,
    is_favorite: data.is_favorite,
    is_trashed: data.is_trashed
});

/**
 * Преобразует данные ссылки из фронтенда в формат бэкенда
 * @param {Object} data - Данные ссылки с фронтенда
 * @returns {Object} Данные ссылки для отправки на бэкенд
 */
export const toBackend = (data) => ({
    url: data.url || '',
    is_favorite: Boolean(data.is_favorite),
    is_trashed: Boolean(data.is_trashed)
});

/**
 * Создает пустую форму ссылки
 * @returns {Object} Пустая форма ссылки
 */
export const createEmptyForm = () => ({
    url: '',
    is_favorite: false,
    is_trashed: false
});
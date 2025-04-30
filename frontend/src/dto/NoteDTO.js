/**
 * Стандартизированный формат заметки для фронтенда
 * @typedef {Object} NoteDTO
 * @property {number} id - ID заметки
 * @property {string} title - Заголовок заметки
 * @property {string} content - Содержимое заметки
 * @property {boolean} is_pinned - Закреплена ли заметка
 * @property {boolean} is_archived - Архивирована ли заметка
 */

/**
 * Преобразует данные заметки из бэкенда в формат фронтенда
 * @param {Object} data - Данные заметки с бэкенда
 * @returns {Object} Нормализованные данные заметки
 */
export const fromBackend = (data) => ({
    id: data.id || data.note_id,
    title: data.title,
    content: data.content,
    is_pinned: data.is_pinned,
    is_archived: data.is_archived
});

/**
 * Преобразует данные заметки из фронтенда в формат бэкенда
 * @param {Object} data - Данные заметки с фронтенда
 * @returns {Object} Данные заметки для отправки на бэкенд
 */
export const toBackend = (data) => ({
    title: data.title,
    content: data.content,
    is_pinned: data.is_pinned || false,
    is_archived: data.is_archived || false
});

/**
 * Создает пустую форму
 */
export const createEmptyForm = () => ({
  title: '',
  content: '',
  is_pinned: false,
  is_archived: false
});
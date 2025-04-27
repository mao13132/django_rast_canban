/**
 * Стандартизированный формат заметки для фронтенда
 * @typedef {Object} NoteDTO
 * @property {number} id - ID заметки
 * @property {string} title - Заголовок заметки
 * @property {string} content - Содержимое заметки
 * @property {number} user_id - ID пользователя-владельца заметки
 * @property {boolean} is_pinned - Закреплена ли заметка
 * @property {boolean} is_archived - Архивирована ли заметка
 */

/**
 * Преобразует данные с бекенда в стандартный формат фронтенда
 */
export const fromBackend = (data) => {
  if (!data) return null;

  return {
    id: data.note_id || data.id,
    title: data.title || '',
    content: data.content || '',
    user_id: data.user_id,
    is_pinned: data.is_pinned || false,
    is_archived: data.is_archived || false
  };
};

/**
 * Преобразует данные формы в формат для отправки на бекенд
 */
export const toBackend = (formData) => {
  return {
    title: formData.title || '',
    content: formData.content || '',
    is_pinned: formData.is_pinned || false,
    is_archived: formData.is_archived || false
  };
};

/**
 * Создает пустую форму
 */
export const createEmptyForm = () => ({
  title: '',
  content: '',
  is_pinned: false,
  is_archived: false
}); 
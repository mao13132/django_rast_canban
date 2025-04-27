/**
 * Стандартизированный формат категории для фронтенда
 * @typedef {Object} CategoryDTO
 * @property {number} id - ID категории
 * @property {string} name - Название категории
 * @property {number} user_id - ID пользователя-владельца категории
 */

/**
 * Преобразует данные с бекенда в стандартный формат фронтенда
 */
export const fromBackend = (data) => {
  if (!data) return null;

  return {
    id: data.category_id || data.id,
    name: data.name || '',
    user_id: data.user_id
  };
};

/**
 * Преобразует данные формы в формат для отправки на бекенд
 */
export const toBackend = (formData) => {
  return {
    name: formData.name || ''
  };
};

/**
 * Создает пустую форму
 */
export const createEmptyForm = () => ({
  name: ''
}); 
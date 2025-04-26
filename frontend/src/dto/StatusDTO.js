/**
 * Стандартизированный формат статуса для фронтенда
 * @typedef {Object} StatusDTO
 * @property {number} id - ID статуса
 * @property {string} name - Название статуса
 * @property {number} order - Порядок отображения статуса
 * @property {string} color - Цвет статуса в формате HEX
 * @property {number} user_id - ID пользователя
 */

/**
 * Преобразует данные с бекенда в стандартный формат фронтенда
 */
export const fromBackend = (data) => {
  if (!data) return null;

  return {
    id: data.status_id || data.id,
    name: data.name || '',
    order: data.order || 0,
    color: data.color || '#A0A9F3',
    user_id: data.user_id
  };
};

/**
 * Преобразует данные формы в формат для отправки на бекенд
 */
export const toBackend = (formData) => {
  return {
    name: formData.name || '',
    order: formData.order || 0,
    color: formData.color || '#A0A9F3'
  };
};

/**
 * Создает пустой статус
 */
export const createEmptyStatus = () => ({
  name: '',
  order: 0,
  color: '#A0A9F3'
}); 
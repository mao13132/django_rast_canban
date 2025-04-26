/**
 * Стандартизированный формат вложения для фронтенда
 * @typedef {Object} AttachmentDTO
 * @property {number} id - ID вложения
 * @property {string} name - Название файла
 * @property {string} path - Путь к файлу
 * @property {number} size - Размер файла в байтах
 * @property {number} task_id - ID задачи
 */

/**
 * Преобразует данные с бекенда в стандартный формат фронтенда
 */
export const fromBackend = (data) => {
  if (!data) return null;

  return {
    id: data.attachment_id || data.id,
    name: data.name || '',
    path: data.path || '',
    size: data.size || 0,
    task_id: data.task_id
  };
};

/**
 * Преобразует данные формы в формат для отправки на бекенд
 */
export const toBackend = (formData) => {
  const formDataObj = new FormData();
  formDataObj.append('name', formData.name || '');
  formDataObj.append('path', formData.file);
  if (formData.task_id) {
    formDataObj.append('task_id', formData.task_id);
  }
  return formDataObj;
};

/**
 * Создает пустое вложение
 */
export const createEmptyAttachment = () => ({
  name: '',
  file: null,
  task_id: null
}); 
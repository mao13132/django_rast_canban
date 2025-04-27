/**
 * Стандартизированный формат задачи для фронтенда
 * @typedef {Object} TaskDTO
 * @property {number} id - ID задачи
 * @property {string} title - Заголовок
 * @property {string} description - Описание
 * @property {Object} status - Статус задачи
 * @property {number} status.id - ID статуса
 * @property {string} status.name - Название статуса
 * @property {number} status.order - Порядок отображения статуса
 * @property {string} status.color - Цвет статуса в формате HEX
 * @property {Object} category - Категория задачи
 * @property {number} category.id - ID категории
 * @property {string} category.name - Название категории
 * @property {string} priority - Приоритет (low/medium/high)
 * @property {Object} deadline - Сроки
 * @property {string} deadline.start - Дата начала
 * @property {string} deadline.end - Дата окончания
 * @property {Array} attachments - Прикрепленные файлы
 * @property {number} user_id - ID пользователя
 * @property {number} days_remaining - Количество оставшихся дней до дедлайна
 */

/**
 * Преобразует данные с бекенда в стандартный формат фронтенда
 */
export const fromBackend = (data) => {
  if (!data) return null;

  return {
    id: data.task_id || data.id,
    title: data.title || '',
    description: data.description || '',
    status: normalizeEntity(data.status),
    category: normalizeEntity(data.category),
    priority: data.priority || 'medium',
    deadline: {
      start: data.deadline?.start || '',
      end: data.deadline?.end || ''
    },
    attachments: data.attachments || [],
    user_id: data.user_id,
    days_remaining: data.days_remaining || null
  };
};

/**
 * Преобразует данные формы в формат для отправки на бекенд
 */
export const toBackend = (formData, files = []) => {
  const formDataObj = new FormData();

  // Основные поля
  formDataObj.append('title', formData.title || '');
  formDataObj.append('description', formData.description || '');
  formDataObj.append('priority', formData.priority || 'medium');
  
  // ID статуса и категории
  if (formData.status) {
    formDataObj.append('status_id', typeof formData.status === 'object' ? formData.status.id : formData.status);
  }
  if (formData.category) {
    formDataObj.append('category_id', typeof formData.category === 'object' ? formData.category.id : formData.category);
  }

  // Сроки
  if (formData.deadline?.start) formDataObj.append('deadline.start', formData.deadline.start);
  if (formData.deadline?.end) formDataObj.append('deadline.end', formData.deadline.end);

  // Файлы
  if (files && files.length > 0) {
    files.forEach(file => {
      formDataObj.append('attachments', file);
    });
  }

  return formDataObj;
};

/**
 * Преобразует данные с бекенда в формат для формы
 */
export const toForm = (data) => {
  if (!data) return null;

  return {
    title: data.title || '',
    description: data.description || '',
    status: data.status?.id || '',
    category: data.category?.id || '',
    priority: data.priority || 'medium',
    deadline: {
      start: data.deadline?.start || '',
      end: data.deadline?.end || ''
    },
    attachments: data.attachments || [],
    days_remaining: data.days_remaining || null
  };
};

/**
 * Нормализует сущность (статус/категорию)
 */
const normalizeEntity = (entity) => {
  if (!entity) return null;
  
  // Если уже в нужном формате
  if (entity.id && entity.name) {
    return {
      id: entity.id,
      name: entity.name,
      order: entity.order || 0,
      color: entity.color || '#A0A9F3'
    };
  }
  
  // Если пришел только id
  if (typeof entity === 'number' || typeof entity === 'string') {
    return { 
      id: Number(entity), 
      name: '',
      order: 0,
      color: '#A0A9F3'
    };
  }
  
  return null;
};

/**
 * Создает пустую форму
 */
export const createEmptyForm = () => ({
  title: '',
  description: '',
  status: '',
  category: '',
  priority: 'medium',
  deadline: {
    start: '',
    end: ''
  },
  attachments: [],
  days_remaining: null
}); 
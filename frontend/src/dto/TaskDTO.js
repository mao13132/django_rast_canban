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
 * @property {Object} note - Заметка задачи
 * @property {number} note.id - ID заметки
 * @property {string} note.title - Заголовок заметки
 * @property {string} note.content - Содержание заметки
 * @property {boolean} note.is_pinned - Закреплена ли заметка
 * @property {boolean} note.is_archived - Архивирована ли заметка
 * @property {Array<Object>} attachments - Вложения задачи
 * @property {number} attachments[].id - ID вложения
 * @property {string} attachments[].name - Название файла
 * @property {number} attachments[].size - Размер файла в байтах
 * @property {string} attachments[].url - URL для скачивания файла
 * @property {string} attachments[].uploaded_at - Дата загрузки
 * @property {string} priority - Приоритет (low/medium/high)
 * @property {Object} deadline - Сроки
 * @property {string} deadline.start - Дата начала
 * @property {string} deadline.end - Дата окончания
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
    note: normalizeNote(data.note),
    attachments: normalizeAttachments(data.attachments),
    priority: data.priority || 'medium',
    deadline: {
      start: data.deadline?.start || '',
      end: data.deadline?.end || ''
    },
    user_id: data.user_id,
    days_remaining: data.days_remaining || null
  };
};

/**
 * Преобразует данные формы в формат для отправки на бекенд
 */
export const toBackend = (formData, files = []) => {
  const formDataObj = new FormData();
  
  // Основные поля (всегда отправляем, даже если пустые)
  formDataObj.append('title', formData.title);
  formDataObj.append('description', formData.description);
  formDataObj.append('priority', formData.priority || 'medium');
  
  // ID статуса и категории (обязательные поля)
  if (formData.status) {
    formDataObj.append('status_id', formData.status);
  } else {
    formDataObj.append('status_id', ''); // Отправляем пустое значение для валидации
  }

  if (formData.category) {
    formDataObj.append('category_id', formData.category);
  } else {
    formDataObj.append('category_id', ''); // Отправляем пустое значение для валидации
  }

  if (formData.note) {
    formDataObj.append('note_id', formData.note);
  } else {
    formDataObj.append('note_id', ''); // Отправляем пустое значение для валидации
  }

  // Сроки (опциональные поля)
  formDataObj.append('deadline_start', formData.deadline?.start || '');
  formDataObj.append('deadline_end', formData.deadline?.end || '');

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
    note: data.note?.id || '',
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
 * Нормализует заметку
 */
const normalizeNote = (note) => {
  if (!note) return null;
  
  // Если уже в нужном формате
  if (note.id && note.title) {
    return {
      id: note.id,
      title: note.title,
      content: note.content || '',
      is_pinned: note.is_pinned || false,
      is_archived: note.is_archived || false
    };
  }
  
  // Если пришел только id
  if (typeof note === 'number' || typeof note === 'string') {
    return { 
      id: Number(note), 
      title: '',
      content: '',
      is_pinned: false,
      is_archived: false
    };
  }
  
  return null;
};

/**
 * Нормализует вложения
 */
const normalizeAttachments = (attachments) => {
  if (!attachments) return [];
  
  return attachments.map(attachment => ({
    id: attachment.attachment_id,
    name: attachment.name,
    size: attachment.size,
    url: attachment.url,
    uploaded_at: attachment.uploaded_at
  }));
};

/**
 * Создает пустую форму
 */
export const createEmptyForm = () => ({
  title: '',
  description: '',
  status: '',
  category: '',
  note: '',
  priority: 'medium',
  deadline: {
    start: '',
    end: ''
  },
  attachments: [],
  days_remaining: null
}); 
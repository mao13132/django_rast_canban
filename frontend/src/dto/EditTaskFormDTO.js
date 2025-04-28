// Создание пустой формы
export const createEmptyForm = () => ({
    id: null,
    title: '',
    description: '',
    priority: 'block',
    status: '',
    category: '',
    note: '',
    deadline: {
        start: '',
        end: ''
    },
    attachments: [],
    created_at: null,
    updated_at: null
});

// Нормализация данных для формы редактирования
export const normalizeFormData = (task) => {
    return {
        id: task.id,
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'block',
        status: task.status?.id || '',
        category: task.category?.id || '',
        note: task.note?.id || '',
        deadline: {
            start: task.deadline?.start || '',
            end: task.deadline?.end || ''
        },
        attachments: task.attachments || [],
        created_at: task.created_at || null,
        updated_at: task.updated_at || null
    };
};

// Преобразование данных формы в формат для бэкенда
export const toBackend = (formData, newFiles = [], existingFiles = []) => {
    const formDataObj = new FormData();
    
    // Добавляем основные поля
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('priority', formData.priority);
    formDataObj.append('status_id', formData.status);
    formDataObj.append('category_id', formData.category);
    formDataObj.append('note_id', formData.note);

    // Добавляем дедлайн
    if (formData.deadline.start) {
        formDataObj.append('deadline_start', formData.deadline.start);
    }
    if (formData.deadline.end) {
        formDataObj.append('deadline_end', formData.deadline.end);
    }

    // Добавляем новые файлы
    newFiles.forEach(file => {
        formDataObj.append('attachments', file);
    });

    // Добавляем ID существующих файлов
    existingFiles.forEach(file => {
        if (file.id) {
            formDataObj.append('existing_attachments', file.id);
        }
    });

    return formDataObj;
}; 
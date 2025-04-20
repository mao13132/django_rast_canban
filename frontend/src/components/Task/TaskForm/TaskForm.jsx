import React, { useState, useEffect } from 'react';
import { useTaskForm } from '../../../context/TaskFormContext';
import { useTask } from '../../../context/TaskContext';
import { useNotification } from '../../../context/NotificationContext';
import styles from './TaskForm.module.css';

const TaskForm = () => {
  const { isOpen, mode, initialData, closeForm } = useTaskForm();
  const { createTask, updateTask, categories, statuses, fetchCategories, fetchStatuses } = useTask();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: null,
    status: null,
    deadline: {
      start: '',
      end: ''
    },
    attachments: []
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        category: initialData.category || null,
        status: initialData.status || null,
        deadline: {
          start: initialData.deadline?.start || '',
          end: initialData.deadline?.end || ''
        },
        attachments: initialData.attachments || []
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('deadline.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        deadline: {
          ...prev.deadline,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Проверяем обязательные поля
    if (!formData.title) {
      showNotification('Название задачи обязательно', 'error');
      setLoading(false);
      return;
    }

    if (!formData.status) {
      showNotification('Статус задачи обязателен', 'error');
      setLoading(false);
      return;
    }

    try {
      const taskData = {
        ...formData,
        attachments: files
      };

      console.log('Submitting task data:', taskData);

      if (mode === 'create') {
        await createTask(taskData);
        showNotification('Задача успешно создана', 'success');
      } else {
        await updateTask(initialData.id, taskData);
        showNotification('Задача успешно обновлена', 'success');
      }

      closeForm();
    } catch (err) {
      console.error('Error saving task:', err);
      if (err.response?.data) {
        // Обрабатываем ошибки валидации
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          // Если ошибка в формате {field: [error1, error2]}
          const errorMessages = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          showNotification(errorMessages, 'error');
        } else {
          // Если ошибка в формате строки
          showNotification(errorData, 'error');
        }
      } else {
        showNotification('Ошибка при сохранении задачи', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <h2>{mode === 'create' ? 'Новая задача' : 'Редактировать задачу'}</h2>
          <button type="button" className={styles.closeButton} onClick={closeForm}>×</button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formGroup}>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Название задачи"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Приоритет</option>
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Описание"
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.fileUpload}>
            <span>Прикрепить файл</span>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className={styles.fileInput}
            />
          </div>
          {files.length > 0 && (
            <div className={styles.fileList}>
              {files.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className={styles.removeFile}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Категория</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Статус</option>
            {statuses.map(status => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.deadlineGroup}>
            <div>
              <label>Начало:</label>
              <input
                type="datetime-local"
                name="deadline.start"
                value={formData.deadline.start}
                onChange={handleChange}
                className={styles.dateInput}
              />
            </div>
            <div>
              <label>Конец:</label>
              <input
                type="datetime-local"
                name="deadline.end"
                value={formData.deadline.end}
                onChange={handleChange}
                className={styles.dateInput}
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button 
            type="button" 
            className={styles.cancelButton} 
            onClick={closeForm}
            disabled={loading}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm; 
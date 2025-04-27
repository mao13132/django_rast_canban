import React, { useState, useEffect } from 'react';
import { useTaskForm } from '../../../context/TaskFormContext';
import { useTaskStore } from '../../../store/taskStore';
import { useNotification } from '../../../context/NotificationContext';
import * as TaskDTO from '../../../dto/TaskDTO';
import styles from './TaskForm.module.css';
import PrioritySelect from './PrioritySelect/PrioritySelect';
import CategorySelect from './CategorySelect/CategorySelect';
import NoteSelect from './NoteSelect/NoteSelect';

const TaskForm = ({ className }) => {
  const { isOpen, mode, initialData, closeForm } = useTaskForm();
  const { 
    createTask, 
    updateTask, 
    fetchCategories, 
    fetchNotes,
    categories, 
    statuses,
    categoriesLoading,
    notesLoading 
  } = useTaskStore();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState(TaskDTO.createEmptyForm());
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Загружаем категории и заметки при открытии формы
      fetchCategories();
      fetchNotes();

      if (mode === 'create') {
        setFormData(TaskDTO.createEmptyForm());
        setFiles([]);
      } else if (initialData) {
        setFormData(TaskDTO.toForm(initialData));
      }
    }
  }, [isOpen, mode, initialData, fetchCategories, fetchNotes]);

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

    if (!formData.title) {
      showNotification('Название задачи обязательно', 'error', 3000, 'bottom');
      setLoading(false);
      return;
    }

    if (!formData.status) {
      showNotification('Статус задачи обязателен', 'error', 3000, 'bottom');
      setLoading(false);
      return;
    }

    try {
      const taskData = {
        ...formData,
        attachments: files
      };

      if (mode === 'create') {
        await createTask(taskData);
        showNotification('Задача успешно создана', 'success', 3000, 'bottom');
      } else {
        await updateTask(initialData.id, taskData);
        showNotification('Задача успешно обновлена', 'success', 3000, 'bottom');
      }

      closeForm();
    } catch (err) {
      console.error('Error saving task:', err);
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          showNotification(errorMessages, 'error', 3000, 'bottom');
        } else {
          showNotification(errorData, 'error', 3000, 'bottom');
        }
      } else {
        showNotification('Ошибка при сохранении задачи', 'error', 3000, 'bottom');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${className || ''}`}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <h2>{mode === 'create' ? 'Новая задача' : 'Редактировать задачу'}</h2>
          <button type="button" className={styles.closeButton} onClick={closeForm}>×</button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formGroup}>
          <div className={styles.selectLabel}>Название задачи</div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder=""
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.selectLabel}>Приоритет</div>
          <PrioritySelect
            value={formData.priority}
            onChange={handleChange}
            className={styles.select}
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.selectLabel}>Описание</div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder=""
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.selectLabel}>Прикрепить файл</div>
          <div className={styles.fileUpload}>
            <img src="/assets/file.png" alt="Файл" className={styles.fileIcon} />
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
          <div className={styles.selectLabel}>Категория</div>
          <CategorySelect
            value={formData.category}
            onChange={handleChange}
            categories={categories}
            className={styles.select}
            loading={categoriesLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.selectLabel}>Заметка</div>
          <NoteSelect
            value={formData.note}
            onChange={handleChange}
            className={styles.select}
            loading={notesLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.selectLabel}>Статус</div>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">Выберите статус</option>
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
          <button type="button" onClick={closeForm} className={styles.cancelButton}>
            Отмена
          </button>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm; 
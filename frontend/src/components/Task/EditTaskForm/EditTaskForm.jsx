import React, { useState, useEffect } from 'react';
import { useEditTaskForm } from '../../../context/EditTaskFormContext';
import { useTaskStore } from '../../../store/taskStore';
import { useNotification } from '../../../context/NotificationContext';
import * as EditTaskFormDTO from '../../../dto/EditTaskFormDTO';
import styles from './EditTaskForm.module.css';
import PrioritySelect from '../TaskForm/PrioritySelect/PrioritySelect';
import CategorySelect from '../TaskForm/CategorySelect/CategorySelect';
import NoteSelect from '../TaskForm/NoteSelect/NoteSelect';
import DateTimeSelect from '../TaskForm/DateTimeSelect/DateTimeSelect';

const EditTaskForm = ({ className }) => {
    const { isOpen, taskData, closeForm, updateTaskData, loading, error, setLoading, setError } = useEditTaskForm();
    const {
        updateTask,
        deleteTask,
        fetchCategories,
        fetchNotes,
        fetchTasks,
        categories,
        statuses,
        categoriesLoading,
        notesLoading
    } = useTaskStore();
    const { showNotification } = useNotification();

    const [formData, setFormData] = useState(EditTaskFormDTO.createEmptyForm());
    const [files, setFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);

    useEffect(() => {
        if (isOpen && taskData) {
            fetchCategories();
            fetchNotes();
            setFormData(EditTaskFormDTO.normalizeFormData(taskData));
            setFiles(taskData.attachments || []);
            setNewFiles([]);
        }
    }, [isOpen, taskData, fetchCategories, fetchNotes]);

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
        setNewFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeFile = (index, isNew = false) => {
        if (isNew) {
            setNewFiles(prev => prev.filter((_, i) => i !== index));
        } else {
            setFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async () => {
        if (!formData.title) {
            showNotification('Название задачи обязательно', 'error', 3000, 'bottom');
            return;
        }

        if (!formData.status) {
            showNotification('Статус задачи обязателен', 'error', 3000, 'bottom');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const taskData = EditTaskFormDTO.toBackend(formData, newFiles, files);
            await updateTask(formData.id, taskData);
            await fetchTasks();
            closeForm();
            showNotification('Задача успешно обновлена', 'success', 3000, 'bottom');
        } catch (err) {
            console.error('Error updating task:', err);
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
                showNotification('Ошибка при обновлении задачи', 'error', 3000, 'bottom');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!taskData?.id) return;

        try {
            await deleteTask(taskData.id);
            await fetchTasks();
            showNotification('Задача успешно удалена', 'success', 3000, 'bottom');
            closeForm();
        } catch (err) {
            console.error('Error deleting task:', err);
            showNotification('Ошибка при удалении задачи', 'error', 3000, 'bottom');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`${styles.overlay} ${className || ''}`} onClick={closeForm}>
            <div className={styles.form} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Редактировать задачу</h2>
                    <select
                        name="status"
                        value={formData.status || ''}
                        onChange={handleChange}
                        className={`${styles.select} ${styles.headerSelect}`}
                        required
                    >
                        {statuses.map(status => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.contentwrapper}>

                    <div className={styles.leftWrapper}>

                        <div className={styles.formGroup}>
                            <div className={styles.selectLabel}>Редактировать описание</div>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder=""
                                className={styles.textarea}
                            />
                        </div>

                        <div className={styles.Oneactions}>
                            <button type="button" onClick={handleSubmit} className={styles.OneButton} disabled={loading}>
                                Сохранить изменения
                            </button>
                            <button type="button" onClick={closeForm} className={styles.OneButton}>
                                Отменить
                            </button>
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
                            {(files.length > 0 || newFiles.length > 0) && (
                                <div className={styles.fileList}>
                                    {files.map((file, index) => (
                                        <div key={`existing-${index}`} className={styles.fileItem}>
                                            <span>{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index, false)}
                                                className={styles.removeFile}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {newFiles.map((file, index) => (
                                        <div key={`new-${index}`} className={styles.fileItem}>
                                            <span>{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index, true)}
                                                className={styles.removeFile}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>



                        <div className={styles.actions}>
                            <button type="button" onClick={closeForm} className={styles.cancelButton}>
                                Отмена
                            </button>
                            <button type="button" onClick={handleDelete} className={styles.deleteButton}>
                                Удалить задачу
                            </button>
                            <button type="button" onClick={handleSubmit} className={styles.submitButton} disabled={loading}>
                                Сохранить изменения
                            </button>
                        </div>

                    </div>

                    <div className={styles.divider}></div>

                    <div className={styles.rightWrapper}>

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
                            <div className={styles.deadlineGroup}>
                                <div className={styles.dateWrapper}>
                                    <label>Начало:</label>
                                    <DateTimeSelect
                                        name="deadline.start"
                                        value={formData.deadline.start}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                </div>
                                <div className={styles.dateWrapper}>
                                    <label>Конец:</label>
                                    <DateTimeSelect
                                        name="deadline.end"
                                        value={formData.deadline.end}
                                        onChange={handleChange}
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                    </div>



                </div>
            </div>
        </div>
    );
};

export default EditTaskForm; 
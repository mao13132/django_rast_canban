import React, { useRef, useState } from 'react';
import { useNoteStore } from '../../../store/noteStore';
import { useNotification } from '../../../context/NotificationContext';
import { useNoteEditor } from '../../../context/NoteEditorContext';
import styles from './NoteEditor.module.css';

const NoteEditor = ({ className }) => {
    const textAreaRef = useRef(null);
    const [title, setTitle] = useState('');
    const [isPinned, setIsPinned] = useState(false);
    const { createNote } = useNoteStore();
    const { showNotification } = useNotification();

    const handleFormatting = (formatType) => {
        const selection = window.getSelection();

        if (!selection || selection.isCollapsed || !selection.toString().trim()) {
            return;
        }

        const range = selection.getRangeAt(0);
        let element;

        switch (formatType) {
            case 'checkbox':
                const container = document.createElement('div');
                
                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = styles.checkboxItem;
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = styles.checkbox;
                checkbox.setAttribute('data-persist', 'true'); // Добавляем атрибут для идентификации
                
                const label = document.createElement('label');
                label.className = styles.checkboxLabel;
                label.appendChild(range.extractContents());
                
                checkboxContainer.appendChild(checkbox);
                checkboxContainer.appendChild(label);
                
                container.appendChild(checkboxContainer);
                
                const lineBreak = document.createElement('div');
                lineBreak.innerHTML = '<br>';
                container.appendChild(lineBreak);
                
                element = container;
                break;
            case 'bold':
                element = document.createElement('strong');
                element.appendChild(range.extractContents());
                break;
            case 'italic':
                element = document.createElement('em');
                element.appendChild(range.extractContents());
                break;
            case 'underline':
                element = document.createElement('u');
                element.appendChild(range.extractContents());
                break;
            case 'strikethrough':
                element = document.createElement('s');
                element.appendChild(range.extractContents());
                break;
            default:
                return;
        }

        range.insertNode(element);
        
        if (formatType === 'checkbox') {
            // Добавляем обработчик изменения состояния чекбокса
            const checkbox = element.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', (e) => {
                e.target.setAttribute('checked', e.target.checked);
            });
        }

        const newRange = document.createRange();
        const sel = window.getSelection();
        newRange.setStartAfter(element);
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
    };

    const handleCreate = async () => {
        if (!title || !textAreaRef.current.innerHTML.trim()) {
            showNotification('Заполните все поля', 'error', 3000, 'bottom');
            return;
        }

        try {
            // Сохраняем состояние всех чекбоксов перед отправкой
            const content = textAreaRef.current.cloneNode(true);
            const checkboxes = content.querySelectorAll('input[type="checkbox"][data-persist="true"]');
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    checkbox.setAttribute('checked', '');
                }
            });

            await createNote({
                title,
                content: content.innerHTML,
                is_pinned: isPinned
            });

            // Очищаем форму после успешного создания
            setTitle('');
            setIsPinned(false);
            textAreaRef.current.innerHTML = '';

            showNotification('Заметка успешно создана', 'success', 3000, 'bottom');
        } catch (error) {
            showNotification('Ошибка при создании заметки', 'error', 3000, 'bottom');
        }
    };

    const { hideEditor } = useNoteEditor();

    const handleClose = () => {
        setTitle('');
        setIsPinned(false);
        textAreaRef.current.innerHTML = '';
        hideEditor();
    };

    return (
        <div className={`${styles.createForm} ${className}`}>
            <div className={styles.pinnedWrapperIcon} onClick={() => setIsPinned(!isPinned)}>
                <img
                    src={isPinned ? "/assets/pinned.png" : "/assets/no_pinned.png"}
                    alt="Закрепить"
                    className={`${styles.pinnedImage} ${isPinned ? styles.active : ''}`}
                />
            </div>

            <div className={styles.wrapperInput}>
                <input
                    type="text"
                    name="title"
                    placeholder="Название"
                    className={styles.inputTitle}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <div
                    className={styles.noteEditor}
                    contentEditable="true"
                    ref={textAreaRef}
                    data-placeholder="Заметка..."
                />
            </div>


            <div className={styles.createFormIcons}>
                <div className={styles.iconWrapper} onClick={() => handleFormatting('checkbox')}>
                    <img src="/assets/sortText.png" alt="Чекбокс" className={styles.textIcon} />
                </div>
                <div className={styles.iconWrapper} onClick={() => handleFormatting('bold')}>
                    <img src="/assets/bold.png" alt="Жирный" className={styles.textIcon} />
                </div>
                <div className={styles.iconWrapper} onClick={() => handleFormatting('italic')}>
                    <img src="/assets/inline.png" alt="Курсив" className={styles.textIcon} />
                </div>
                <div className={styles.iconWrapper} onClick={() => handleFormatting('underline')}>
                    <img src="/assets/u.png" alt="Подчеркнутый" className={styles.textIcon} />
                </div>
                <div className={styles.iconWrapper} onClick={() => handleFormatting('strikethrough')}>
                    <img src="/assets/text.png" alt="Зачеркнутый" className={styles.textIcon} />
                </div>
            </div>

            <div className={styles.actions}>
                <div className={styles.close} onClick={handleClose}>Закрыть</div>
                <div className={styles.create} onClick={handleCreate}>Создать</div>
            </div>
        </div>
    );
};

export default NoteEditor;
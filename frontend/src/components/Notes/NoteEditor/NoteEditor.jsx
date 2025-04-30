import React, { useRef, useState } from 'react';
import { useNoteStore } from '../../../store/noteStore';
import { useNotification } from '../../../context/NotificationContext';
import styles from './NoteEditor.module.css';

const NoteEditor = ({ className }) => {
    const textAreaRef = useRef(null);
    const [title, setTitle] = useState('');
    const [isPinned, setIsPinned] = useState(false);
    const { createNote } = useNoteStore();
    const { showNotification } = useNotification();

    const handleFormatting = (formatType) => {
        const selection = window.getSelection();

        // Проверяем, есть ли выделенный текст
        if (!selection || selection.isCollapsed || !selection.toString().trim()) {
            return; // Если текст не выделен, прекращаем выполнение функции
        }

        const range = selection.getRangeAt(0);
        let element;

        switch (formatType) {
            case 'list':
                const listElement = document.createElement('ul');
                const listItem = document.createElement('li');
                listItem.appendChild(range.extractContents());
                listElement.appendChild(listItem);
                element = listElement;
                break;
            case 'bold':
                element = document.createElement('strong');
                break;
            case 'italic':
                element = document.createElement('em');
                break;
            case 'underline':
                element = document.createElement('u');
                break;
            case 'strikethrough':
                element = document.createElement('s');
                break;
            default:
                return;
        }

        if (formatType !== 'list') {
            element.appendChild(range.extractContents());
        }
        range.insertNode(element);
    };

    const handleCreate = async () => {
        if (!title || !textAreaRef.current.innerHTML.trim()) {
            showNotification('Заполните все поля', 'error', 3000, 'bottom');
            return;
        }

        try {
            await createNote({
                title,
                content: textAreaRef.current.innerHTML,
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

    const handleClose = () => {
        setTitle('');
        setIsPinned(false);
        textAreaRef.current.innerHTML = '';
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
                <div className={styles.iconWrapper} onClick={() => handleFormatting('list')}>
                    <img src="/assets/sortText.png" alt="Список" className={styles.textIcon} />
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
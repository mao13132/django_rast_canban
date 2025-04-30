import { useRef, useState } from 'react';
import { useNoteStore } from '../store/noteStore';
import { useNotification } from '../context/NotificationContext';

export const useNoteEditing = (initialData = { title: '', content: '', isPinned: false }) => {
    const textAreaRef = useRef(null);
    const [title, setTitle] = useState(initialData.title);
    const [isPinned, setIsPinned] = useState(initialData.isPinned);
    const { createNote, updateNote } = useNoteStore();
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
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.setAttribute('data-persist', 'true');
                const label = document.createElement('label');
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

    const saveNote = async (noteId = null) => {
        if (!title || !textAreaRef.current?.innerHTML.trim()) {
            showNotification('Заполните все поля', 'error', 3000, 'bottom');
            return false;
        }

        try {
            const content = textAreaRef.current.cloneNode(true);
            const checkboxes = content.querySelectorAll('input[type="checkbox"][data-persist="true"]');
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    checkbox.setAttribute('checked', '');
                }
            });

            const noteData = {
                title,
                content: content.innerHTML,
                is_pinned: isPinned
            };

            if (noteId) {
                await updateNote(noteId, noteData);
                showNotification('Заметка успешно обновлена', 'success', 3000, 'bottom');
            } else {
                await createNote(noteData);
                showNotification('Заметка успешно создана', 'success', 3000, 'bottom');
            }

            return true;
        } catch (error) {
            showNotification(
                noteId ? 'Ошибка при обновлении заметки' : 'Ошибка при создании заметки',
                'error',
                3000,
                'bottom'
            );
            return false;
        }
    };

    const resetForm = () => {
        setTitle('');
        setIsPinned(false);
        if (textAreaRef.current) {
            textAreaRef.current.innerHTML = '';
        }
    };

    return {
        title,
        setTitle,
        isPinned,
        setIsPinned,
        textAreaRef,
        handleFormatting,
        saveNote,
        resetForm
    };
};
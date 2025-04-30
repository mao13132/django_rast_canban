import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNoteStore } from '../../store/noteStore';
import { useNoteEditing } from '../../hooks/useNoteEditing';
import SubHeader from '../../components/SubHeader/SubHeader';
import Header from '../../components/Header';
import styles from './EditNote.module.css';

const EditNote = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { notes, fetchNotes } = useNoteStore();
    const {
        title,
        setTitle,
        isPinned,
        setIsPinned,
        textAreaRef,
        handleFormatting,
        saveNote
    } = useNoteEditing();

    useEffect(() => {
        const loadNote = async () => {
            await fetchNotes();
            const note = notes.find(note => note.id === Number(id));
            if (note) {
                setTitle(note.title);
                setIsPinned(note.is_pinned);
                if (textAreaRef.current) {
                    textAreaRef.current.innerHTML = note.content;
                }
            }
        };
        loadNote();
    }, [id, fetchNotes]);

    const handleSave = async () => {
        const success = await saveNote(id);
        if (success) {
            navigate('/notes');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.editor}>
                <Header
                    navigationLinks={[
                        { label: 'Главная страница', path: '/' },
                        { label: 'Файлы', path: '/files' }
                    ]}
                />

                <div className={styles.contentWrapper}>
                    <SubHeader
                        title={title}
                        navLinks={[
                            { label: 'Заметки', path: '/notes' },
                            { label: 'Архив заметок', path: '/archive' },
                            { label: 'Доска задач', path: '/' }
                        ]}
                    />

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Заголовок"
                            className={styles.titleInput}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <div
                            ref={textAreaRef}
                            contentEditable="true"
                            className={styles.contentInput}
                            data-placeholder="Заметка..."
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.pinLabel}>
                            <input
                                type="checkbox"
                                checked={isPinned}
                                onChange={(e) => setIsPinned(e.target.checked)}
                                className={styles.checkbox}
                            />
                            Закрепить заметку
                        </label>
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
                        <button onClick={() => navigate('/notes')} className={styles.cancelButton}>
                            Отмена
                        </button>
                        <button onClick={handleSave} className={styles.saveButton}>
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditNote;
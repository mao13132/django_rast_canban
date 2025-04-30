import React from 'react';
import { useNoteEditor } from '../../../context/NoteEditorContext';
import { useNoteEditing } from '../../../hooks/useNoteEditing';
import styles from './NoteEditor.module.css';

const NoteEditor = ({ className }) => {
    const { hideEditor } = useNoteEditor();
    const {
        title,
        setTitle,
        isPinned,
        setIsPinned,
        textAreaRef,
        handleFormatting,
        saveNote,
        resetForm
    } = useNoteEditing();

    const handleCreate = async () => {
        const success = await saveNote();
        if (success) {
            resetForm();
            hideEditor();
        }
    };

    const handleClose = () => {
        resetForm();
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
                {['checkbox', 'bold', 'italic', 'underline', 'strikethrough'].map((type) => (
                    <div key={type} className={styles.iconWrapper} onClick={() => handleFormatting(type)}>
                        <img 
                            src={`/assets/${type}.png`}
                            alt={type}
                            className={styles.textIcon}
                        />
                    </div>
                ))}
            </div>

            <div className={styles.actions}>
                <div className={styles.close} onClick={handleClose}>Закрыть</div>
                <div className={styles.create} onClick={handleCreate}>Создать</div>
            </div>
        </div>
    );
};

export default NoteEditor;
import React, { useRef } from 'react';
import styles from './NoteEditor.module.css';

const NoteEditor = ({ className }) => {
    const textAreaRef = useRef(null);

    const handleFormatting = (formatType) => {
        const selection = window.getSelection();
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

    return (
        <div className={`${styles.createForm} ${className}`}>
            <div className={styles.pinnedWrapperIcon}>
                <img src="/assets/pinned.png" alt="Закрепить" className={styles.logoImage} />
            </div>

            <div className={styles.wrapperInput}>
                <input
                    type="text"
                    name="title"
                    placeholder="Название"
                    className={styles.input}
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
        </div>
    );
};

export default NoteEditor;
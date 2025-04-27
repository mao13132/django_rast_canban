import React, { useState, useRef, useEffect } from 'react';
import { getPriorityIcon } from '../../../../utils/PriorityIcons';
import styles from './PrioritySelect.module.css';

const PrioritySelect = ({ value, onChange, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const options = [
        { value: 'low', label: 'Низкий' },
        { value: 'medium', label: 'Средний' },
        { value: 'high', label: 'Высокий' },
        { value: 'block', label: 'Блокер' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (value) => {
        onChange({ target: { name: 'priority', value } });
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`${styles.prioritySelect} ${className}`} ref={selectRef}>
            <div
                className={styles.prioritySelectHeader}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={styles.priorityOption}>
                    <div className={styles.iconWrapper}>
                        {getPriorityIcon(value, styles.priorityIcon)}
                    </div>
                    <span>{selectedOption?.label}</span>
                </div>
                <span className={styles.selectArrow}>
                    <img src="/assets/arrow.png" alt="Логотип" className={styles.arrowIcon} />
                </span>
            </div>

            {isOpen && (
                <div className={styles.priorityOptions}>
                    {options.map(option => (
                        <div
                            key={option.value}
                            className={`${styles.priorityOption} ${option.value === value ? styles.selected : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >

                            <div className={styles.iconWrapper}>
                                {getPriorityIcon(option.value, styles.priorityIcon)}
                            </div>

                            <span>{option.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PrioritySelect; 
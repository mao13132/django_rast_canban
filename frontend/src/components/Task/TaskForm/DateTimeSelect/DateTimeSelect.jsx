import React, { useState, useRef, useEffect } from 'react';
import styles from './DateTimeSelect.module.css';

const DateTimeSelect = ({ value, onChange, name, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateChange = (e) => {
    const newDate = new Date(tempDate);
    const [hours, minutes] = e.target.value.split(':');
    newDate.setHours(parseInt(hours), parseInt(minutes));
    setTempDate(newDate);
  };

  const handleConfirm = () => {
    const formattedDate = tempDate.toISOString().slice(0, 16);
    onChange({ target: { name, value: formattedDate } });
    setIsOpen(false);
  };

  const formatDisplayValue = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div 
        className={styles.select} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.displayValue}>
          {value ? formatDisplayValue(value) : placeholder}
        </span>
      </div>
      
      {isOpen && (
        <div className={styles.dropdown}>
          <input
            type="datetime-local"
            value={tempDate.toISOString().slice(0, 16)}
            onChange={handleDateChange}
            className={styles.input}
          />
          <button 
            className={styles.confirmButton}
            onClick={handleConfirm}
          >
            ОК
          </button>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelect; 
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
    const newDate = new Date(e.target.value);
    setTempDate(newDate);
  };

  const handleConfirm = () => {
    // Получаем локальное время в формате YYYY-MM-DDTHH:mm
    const year = tempDate.getFullYear();
    const month = String(tempDate.getMonth() + 1).padStart(2, '0');
    const day = String(tempDate.getDate()).padStart(2, '0');
    const hours = String(tempDate.getHours()).padStart(2, '0');
    const minutes = String(tempDate.getMinutes()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    onChange({ target: { name, value: formattedDate } });
    setIsOpen(false);
  };

  const formatDisplayValue = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formatInputValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
            value={formatInputValue(tempDate)}
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
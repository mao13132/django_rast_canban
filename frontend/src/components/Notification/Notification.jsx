import React from 'react';
import styles from './Notification.module.css';

const Notification = ({ message, type = 'error', position = 'top' }) => {
  return (
    <div className={`${styles.notification} ${styles[type]} ${styles[position]}`}>
      {message}
    </div>
  );
};

export default Notification; 
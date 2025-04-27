import React from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
      />
      <div className={styles.wrapperIcon}>
        <img src="/assets/search.png" alt="Логотип" className={styles.searchImage} />
      </div>
    </div>
  );
};

export default SearchBar; 
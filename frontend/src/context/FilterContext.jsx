import React, { createContext, useContext, useState } from 'react';

/**
 * Контекст для управления состоянием фильтра задач
 */
const FilterContext = createContext();

/**
 * Провайдер контекста фильтра
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние элементы
 */
export const FilterProvider = ({ children }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => setIsFilterOpen(prev => !prev);
  const closeFilter = () => setIsFilterOpen(false);
  const openFilter = () => setIsFilterOpen(true);

  return (
    <FilterContext.Provider value={{
      isFilterOpen,
      toggleFilter,
      closeFilter,
      openFilter
    }}>
      {children}
    </FilterContext.Provider>
  );
};

/**
 * Хук для использования контекста фильтра
 */
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter должен использоваться внутри FilterProvider');
  }
  return context;
}; 
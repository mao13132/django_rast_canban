import { useMemo } from 'react';

/**
 * Хук для форматирования размера файла в человекочитаемый формат
 * @param {number} bytes - Размер в байтах
 * @returns {string} Отформатированный размер с единицей измерения
 */
export const useFileSize = (bytes) => {
  return useMemo(() => {
    if (bytes === 0 || bytes === undefined || bytes === null || bytes === '—') return '—';

    const units = ['Б', 'КБ', 'МБ', 'ГБ'];
    const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = (bytes / Math.pow(1024, unitIndex)).toFixed(1);

    return `${value} ${units[unitIndex]}`;
  }, [bytes]);
};
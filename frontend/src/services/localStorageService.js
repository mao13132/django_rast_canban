/**
 * Сервис для работы с localStorage
 */
class LocalStorageService {
  /**
   * Получить значение из localStorage
   * @param {string} key - Ключ для получения значения
   * @param {any} defaultValue - Значение по умолчанию, если ключ не найден
   * @returns {any} Значение из localStorage или значение по умолчанию
   */
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Ошибка при получении ${key} из localStorage:`, error);
      return defaultValue;
    }
  }

  /**
   * Сохранить значение в localStorage
   * @param {string} key - Ключ для сохранения
   * @param {any} value - Значение для сохранения
   */
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Ошибка при сохранении ${key} в localStorage:`, error);
    }
  }

  /**
   * Удалить значение из localStorage
   * @param {string} key - Ключ для удаления
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Ошибка при удалении ${key} из localStorage:`, error);
    }
  }

  /**
   * Очистить весь localStorage
   */
  static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Ошибка при очистке localStorage:', error);
    }
  }
}

export default LocalStorageService; 
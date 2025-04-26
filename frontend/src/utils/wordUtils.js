/**
 * Склоняет слово "задача" в зависимости от количества
 * @param {number} count - Количество задач
 * @returns {string} Слово "задача" в правильном склонении
 */
export const getTaskWord = (count) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'задач';
  }

  switch (lastDigit) {
    case 1:
      return 'задача';
    case 2:
    case 3:
    case 4:
      return 'задачи';
    default:
      return 'задач';
  }
}; 
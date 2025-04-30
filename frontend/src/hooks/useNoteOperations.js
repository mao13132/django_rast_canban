import { useNoteStore } from '../store/noteStore';
import { useNotification } from '../context/NotificationContext';

/**
 * Хук для операций с заметками
 * @param {string} searchQuery - Строка поиска для фильтрации заметок
 * @returns {Object} Объект с функциями для работы с заметками
 */
export const useNoteOperations = (searchQuery) => {
  const { fetchNotes, getFilteredNotes, updateNote, deleteNote } = useNoteStore();
  const { showNotification } = useNotification();

  /**
   * Закрепление/открепление заметки
   * @param {number} id - ID заметки
   */
  const handlePin = async (id) => {
    const note = getFilteredNotes(searchQuery).find(n => n.id === id);
    if (!note) return;

    try {
      await updateNote(id, { ...note, is_pinned: !note.is_pinned });
      await fetchNotes();
      showNotification(
        `Заметка ${note.is_pinned ? 'откреплена' : 'закреплена'}`,
        'success',
        3000,
        'bottom'
      );
    } catch (error) {
      showNotification('Ошибка при обновлении заметки', 'error', 3000, 'bottom');
    }
  };

  /**
   * Архивация/разархивация заметки
   * @param {number} id - ID заметки
   */
  const handleArchive = async (id) => {
    const note = getFilteredNotes(searchQuery).find(n => n.id === id);
    if (!note) return;

    try {
      const confirmMessage = note.is_archived
        ? 'Вы уверены, что хотите разархивировать эту заметку?'
        : 'Вы уверены, что хотите архивировать эту заметку?';

      if (!window.confirm(confirmMessage)) return;

      await updateNote(id, { ...note, is_archived: !note.is_archived });
      await fetchNotes();
      showNotification(
        `Заметка ${note.is_archived ? 'разархивирована' : 'архивирована'}`,
        'success',
        3000,
        'bottom'
      );
    } catch (error) {
      showNotification('Ошибка при архивации заметки', 'error', 3000, 'bottom');
    }
  };

  /**
   * Удаление заметки
   * @param {number} id - ID заметки
   */
  const handleDelete = async (id) => {
    const note = getFilteredNotes(searchQuery).find(n => n.id === id);
    if (!note) return;

    try {
      if (!window.confirm('Вы уверены, что хотите удалить эту заметку?')) return;

      await deleteNote(id);
      await fetchNotes();
      showNotification('Заметка успешно удалена', 'success', 3000, 'bottom');
    } catch (error) {
      showNotification('Ошибка при удалении заметки', 'error', 3000, 'bottom');
    }
  };

  /**
   * Разархивирование заметки
   * @param {number} id - ID заметки
   */
  const handleUnarchive = async (id) => {
    const note = getFilteredNotes(searchQuery).find(n => n.id === id);
    if (!note) return;

    try {
      await updateNote(id, { ...note, is_archived: false });
      await fetchNotes();
      showNotification('Заметка успешно разархивирована', 'success', 3000, 'bottom');
    } catch (error) {
      showNotification('Ошибка при разархивировании заметки', 'error', 3000, 'bottom');
    }
  };

  return {
    handlePin,
    handleArchive,
    handleDelete,
    handleUnarchive
  };
};
import { create } from 'zustand';
import { notesAPI } from '../services/api';
import * as NoteDTO from '../dto/NoteDTO';

export const useNoteStore = create((set, get) => ({
  // Состояние
  notes: [],
  loading: false,
  error: null,

  // Действия
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Получение всех заметок
  fetchNotes: async () => {
    try {
      set({ loading: true });
      const response = await notesAPI.getNotes();
      const normalizedNotes = response.data.map(NoteDTO.fromBackend);
      set({ notes: normalizedNotes, error: null });
    } catch (err) {
      console.error('Ошибка при загрузке заметок:', err);
      set({ error: 'Ошибка при загрузке заметок', notes: [] });
    } finally {
      set({ loading: false });
    }
  },

  // Создание заметки
  createNote: async (noteData) => {
    try {
      set({ loading: true });
      const response = await notesAPI.createNote(noteData);
      const newNote = NoteDTO.fromBackend(response.data);
      set((state) => ({
        notes: [...state.notes, newNote]
      }));
      return newNote;
    } catch (err) {
      console.error('Ошибка при создании заметки:', err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Обновление заметки
  updateNote: async (noteId, noteData) => {
    try {
      set({ loading: true });
      const response = await notesAPI.updateNote(noteId, noteData);
      const updatedNote = NoteDTO.fromBackend(response.data);
      set((state) => ({
        notes: state.notes.map(note => 
          note.note_id === noteId ? updatedNote : note
        )
      }));
      return updatedNote;
    } catch (err) {
      console.error('Ошибка при обновлении заметки:', err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Удаление заметки
  deleteNote: async (noteId) => {
    try {
      set({ loading: true });
      await notesAPI.deleteNote(noteId);
      set((state) => ({
        notes: state.notes.filter(note => note.note_id !== noteId)
      }));
    } catch (err) {
      console.error('Ошибка при удалении заметки:', err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Получение отфильтрованных заметок
  getFilteredNotes: (searchQuery = '', type = 'all') => {
    const notes = get().notes;
    return notes.filter(note => {
      // Фильтрация по типу (закрепленные/обычные)
      if (type === 'pinned' && !note.is_pinned) return false;
      if (type === 'other' && note.is_pinned) return false;
      
      // Фильтрация по поисковому запросу
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }
}));
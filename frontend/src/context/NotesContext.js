import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './NotificationContext';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // Получение заметки по ID
  const getNote = async (id) => {
    try {
      const response = await fetch(`/api/v1/notes/notes/${id}/`);
      if (!response.ok) {
        throw new Error('Ошибка при получении заметки');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      showNotification('Ошибка при загрузке заметки', 'error', 3000, 'bottom');
      return null;
    }
  };

  // Обновление заметки
  const updateNote = async (id, noteData) => {
    try {
      const response = await fetch(`/api/v1/notes/notes/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении заметки');
      }

      const updatedNote = await response.json();
      setNotes(notes.map(note => 
        note.id === id ? updatedNote : note
      ));
      showNotification('Заметка успешно обновлена', 'success', 3000, 'bottom');
      return updatedNote;
    } catch (error) {
      showNotification('Ошибка при обновлении заметки', 'error', 3000, 'bottom');
      return null;
    }
  };

  // Создание новой заметки
  const createNote = async (noteData) => {
    try {
      const response = await fetch('/api/v1/notes/notes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании заметки');
      }

      const newNote = await response.json();
      setNotes([...notes, newNote]);
      showNotification('Заметка успешно создана', 'success', 3000, 'bottom');
      return newNote;
    } catch (error) {
      showNotification('Ошибка при создании заметки', 'error', 3000, 'bottom');
      return null;
    }
  };

  // Удаление заметки
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`/api/v1/notes/notes/${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении заметки');
      }

      setNotes(notes.filter(note => note.id !== id));
      showNotification('Заметка успешно удалена', 'success', 3000, 'bottom');
      return true;
    } catch (error) {
      showNotification('Ошибка при удалении заметки', 'error', 3000, 'bottom');
      return false;
    }
  };

  // Получение всех заметок
  const getNotes = async () => {
    try {
      const response = await fetch('/api/v1/notes/notes/');
      if (!response.ok) {
        throw new Error('Ошибка при получении заметок');
      }
      const data = await response.json();
      setNotes(data);
      return data;
    } catch (error) {
      showNotification('Ошибка при загрузке заметок', 'error', 3000, 'bottom');
      return [];
    }
  };

  const value = {
    notes,
    getNote,
    updateNote,
    createNote,
    deleteNote,
    getNotes,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}; 
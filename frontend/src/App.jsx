import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext.js';
import { TaskFormProvider } from './context/TaskFormContext';
import { NotificationProvider } from './context/NotificationContext';
import { NotesProvider } from './context/NotesContext';
import { PopupProvider } from './context/PopupContext';
import Popup from './components/Popup';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PopupProvider>
          <NotificationProvider>
            <TaskProvider>
              <TaskFormProvider>
                <NotesProvider>
                  <AppRoutes />
                  <Popup />
                </NotesProvider>
              </TaskFormProvider>
            </TaskProvider>
          </NotificationProvider>
        </PopupProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 
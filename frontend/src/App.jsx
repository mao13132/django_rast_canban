import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskFormProvider } from './context/TaskFormContext';
import { NotificationProvider } from './context/NotificationContext';
import { NotesProvider } from './context/NotesContext';
import { PopupProvider } from './context/PopupContext';
import { ProfileProvider } from './context/ProfileContext';
import { TaskSearchProvider } from './context/TaskSearchContext';
import { CategoryPopupProvider } from './context/CategoryPopupContext';
import { NotePopupProvider } from './context/NotePopupContext';
import Popup from './components/Popup';
import Profile from './components/Profile/ProfilePopup/ProfilePopup.jsx';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PopupProvider>
          <NotificationProvider>
            <TaskSearchProvider>
              <TaskFormProvider>
                <NotesProvider>
                  <ProfileProvider>
                    <CategoryPopupProvider>
                      <NotePopupProvider>
                        <AppRoutes />
                        <Popup />
                        <Profile />
                      </NotePopupProvider>
                    </CategoryPopupProvider>
                  </ProfileProvider>
                </NotesProvider>
              </TaskFormProvider>
            </TaskSearchProvider>
          </NotificationProvider>
        </PopupProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 
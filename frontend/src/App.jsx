import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskFormProvider } from './context/TaskFormContext';
import { NotificationProvider } from './context/NotificationContext';
import { NotesProvider } from './context/NotesContext';
import { PopupProvider } from './context/PopupContext';
import { ProfileProvider } from './context/ProfileContext';
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
              <TaskFormProvider>
                <NotesProvider>
                  <ProfileProvider>
                    <AppRoutes />
                    <Popup />
                    <Profile />
                  </ProfileProvider>
                </NotesProvider>
              </TaskFormProvider>
          </NotificationProvider>
        </PopupProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App; 
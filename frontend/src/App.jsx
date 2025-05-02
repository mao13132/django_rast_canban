import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FolderPopupProvider } from './context/FolderPopupContext';
import { TaskFormProvider } from './context/TaskFormContext';
import { FileMenuProvider } from './context/FileMenuContext';
import { FilePopupProvider } from './context/FilePopupContext';
import { NotificationProvider } from './context/NotificationContext';
import { PopupProvider } from './context/PopupContext';
import { ProfileProvider } from './context/ProfileContext';
import { TaskSearchProvider } from './context/TaskSearchContext';
import { CategoryPopupProvider } from './context/CategoryPopupContext';
import { NotePopupProvider } from './context/NotePopupContext';
import Popup from './components/Popup';
import { NoteEditorProvider } from './context/NoteEditorContext';
import Profile from './components/Profile/ProfilePopup/ProfilePopup.jsx';
import AppRoutes from './routes/AppRoutes';
import { EditTaskFormProvider } from './context/EditTaskFormContext';
import './App.css';

function App() {
  return (
    <FilePopupProvider>
      <FileMenuProvider>
        <FolderPopupProvider>
          <NoteEditorProvider>
            <BrowserRouter>
              <AuthProvider>
                <PopupProvider>
                  <NotificationProvider>
                    <TaskSearchProvider>
                      <TaskFormProvider>
                        <EditTaskFormProvider>
                          <ProfileProvider>
                            <CategoryPopupProvider>
                              <NotePopupProvider>
                                <AppRoutes />
                                <Popup />
                                <Profile />
                              </NotePopupProvider>
                            </CategoryPopupProvider>
                          </ProfileProvider>
                        </EditTaskFormProvider>
                      </TaskFormProvider>
                    </TaskSearchProvider>
                  </NotificationProvider>
                </PopupProvider>
              </AuthProvider>
            </BrowserRouter>
          </NoteEditorProvider>
        </FolderPopupProvider>
      </FileMenuProvider>
    </FilePopupProvider>
  );
}

export default App; 
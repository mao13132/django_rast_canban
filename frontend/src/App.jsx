import { RenamePopupProvider } from './context/RenamePopupContext';
import RenamePopup from './components/FileControls/RenamePopup/RenamePopup';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LinkPopupProvider } from './context/LinkPopupContext';
import { FolderPopupProvider } from './context/FolderPopupContext';
import { FolderUploadProvider } from './context/FolderUploadContext';
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
    <LinkPopupProvider>
      <RenamePopupProvider>
        <FolderUploadProvider>
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
                                      <RenamePopup />
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
        </FolderUploadProvider>
      </RenamePopupProvider>
    </LinkPopupProvider>
  );
}

export default App; 
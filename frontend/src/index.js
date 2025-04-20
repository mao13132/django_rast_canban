import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TaskProvider } from './context/TaskContext';
import { TaskFilterProvider } from './context/TaskFilterContext';
import { TaskFormProvider } from './context/TaskFormContext';
import { AuthProvider } from './context/AuthContext';
import { PopupProvider } from './context/PopupContext';
import { NotificationProvider } from './context/NotificationContext';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <PopupProvider>
          <TaskProvider>
            <TaskFilterProvider>
              <TaskFormProvider>
                <App />
              </TaskFormProvider>
            </TaskFilterProvider>
          </TaskProvider>
        </PopupProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

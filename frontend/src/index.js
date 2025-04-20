import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TaskProvider } from './context/TaskContext';
import { TaskFilterProvider } from './context/TaskFilterContext';
import { TaskFormProvider } from './context/TaskFormContext';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TaskProvider>
      <TaskFilterProvider>
        <TaskFormProvider>
          <App />
        </TaskFormProvider>
      </TaskFilterProvider>
    </TaskProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

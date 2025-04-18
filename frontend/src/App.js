import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PopupProvider } from './context/PopupContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/UI/PrivateRoute';
import Popup from './components/Popup';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <PopupProvider>
        <Router>
          <Popup />
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Защищенные маршруты */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/files" element={<Dashboard />} />
              <Route path="/notes" element={<Dashboard />} />
              <Route path="/tasks" element={<Dashboard />} />
            </Route>

            {/* Маршрут для несуществующих страниц */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
      </PopupProvider>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Notes from '../pages/Notes/Notes';
import ArchiveNotes from '../pages/ArchiveNotes/ArchiveNotes';
import EditNote from '../pages/EditNote/EditNote';
import Files from '../pages/Files/Files';
import FavoriteFiles from '../pages/FavoriteFiles/FavoriteFiles';
import TrashFiles from '../pages/TrashFiles/TrashFiles';
import Profile from '../pages/Profile/Profile';
import ProfileEdit from '../pages/ProfileEdit/ProfileEdit';
import { useAuth } from '../context/AuthContext';
import Home from '../pages/Home/Home';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Dashboard /> : <Home />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />} />
      <Route path="/notes" element={isAuthenticated ? <Notes /> : <Navigate to="/" replace />} />
      <Route path="/archive" element={isAuthenticated ? <ArchiveNotes /> : <Navigate to="/" replace />} />
      <Route path="/notes/:id/edit" element={isAuthenticated ? <EditNote /> : <Navigate to="/" replace />} />
      <Route path="/files" element={isAuthenticated ? <Files /> : <Navigate to="/" replace />} />
      <Route path="/files/folder/:folderId" element={isAuthenticated ? <Files /> : <Navigate to="/" replace />} />
      <Route path="/files/favorite" element={isAuthenticated ? <FavoriteFiles /> : <Navigate to="/" replace />} />
      <Route path="/files/trash" element={isAuthenticated ? <TrashFiles /> : <Navigate to="/" replace />} />
      <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />} />
      <Route path="/profile/edit" element={isAuthenticated ? <ProfileEdit /> : <Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
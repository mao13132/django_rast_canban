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

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/archive" element={<ArchiveNotes />} />
      <Route path="/notes/:id/edit" element={<EditNote />} />
      <Route path="/files" element={<Files />} />
      <Route path="/files/favorite" element={<FavoriteFiles />} />
      <Route path="/files/trash" element={<TrashFiles />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<ProfileEdit />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 
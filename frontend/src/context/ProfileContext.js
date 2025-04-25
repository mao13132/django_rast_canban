import React, { createContext, useState, useContext } from 'react';

const ProfileContext = createContext(null);

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfile = () => {
    setIsProfileOpen(prev => !prev);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  return (
    <ProfileContext.Provider value={{ isProfileOpen, toggleProfile, closeProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}; 
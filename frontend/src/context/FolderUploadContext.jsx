import React, { createContext, useContext, useState } from 'react';

const FolderUploadContext = createContext();

export const FolderUploadProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentFolderId, setCurrentFolderId] = useState(null);

    const openPopup = (folderId = null) => {
        setCurrentFolderId(folderId);
        setIsOpen(true);
    };

    const closePopup = () => {
        setIsOpen(false);
        setCurrentFolderId(null);
    };

    return (
        <FolderUploadContext.Provider value={{
            isOpen,
            currentFolderId,
            openPopup,
            closePopup
        }}>
            {children}
        </FolderUploadContext.Provider>
    );
};

export const useFolderUpload = () => {
    const context = useContext(FolderUploadContext);
    if (!context) {
        throw new Error('useFolderUpload должен использоваться внутри FolderUploadProvider');
    }
    return context;
};
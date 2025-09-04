import React, { createContext, useContext } from 'react';

// Create Dark Mode Context
const DarkModeContext = createContext();

// Custom hook to use dark mode
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export default DarkModeContext;

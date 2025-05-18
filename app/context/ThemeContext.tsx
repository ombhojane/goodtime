'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { defaultTheme, ThemeColor, getThemeClasses } from '../themes';

type ThemeContextType = {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeColor>(defaultTheme);
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Check user preference for dark mode
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);

    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('theme') as ThemeColor;
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedTheme && Object.keys(defaultTheme).includes(savedTheme)) {
      setTheme(savedTheme);
    }
    
    if (savedMode) {
      setIsDark(savedMode === 'true');
    }

    // Apply theme to the document
    applyTheme(savedTheme || theme, savedMode === 'true' || prefersDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem('darkMode', String(newMode));
    applyTheme(theme, newMode);
  };

  const changeTheme = (newTheme: ThemeColor) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme, isDark);
  };

  const applyTheme = (themeId: ThemeColor, dark: boolean) => {
    // Add theme classes to document element
    const themeClasses = getThemeClasses(themeId, dark);
    
    // Set dark mode class
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Set theme variable for use in CSS
    document.documentElement.dataset.theme = themeId;
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme: changeTheme, 
        isDark, 
        toggleDarkMode 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 
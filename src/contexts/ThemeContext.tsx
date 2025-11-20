import React, { createContext, useContext, ReactNode } from 'react';
import { LevelTheme } from '../types';
import { getTheme } from '../themes/levelThemes';

interface ThemeContextType {
  theme: LevelTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  themeId: string;
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ themeId, children }) => {
  const theme = getTheme(themeId);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme options
export const themeOptions = {
  colors: {
    default: {
      primary: '#F97316',
      secondary: '#64748B',
      accent: '#FFB31F',
      success: '#28AA7A',
      danger: '#EC5347',
      info: '#009BD3',
      warning: '#FFB31F',
      light: '#FFFFFF',
      dark: '#081021',
      lightBg: '#FFFFFF',
      darkBg: '#112A46',
      lightAccent: '#FFC9CA',
      darkAccent: '#FDE5E3',
    },
    blue: {
      primary: '#3B82F6',
      secondary: '#64748B',
      accent: '#60A5FA',
      success: '#10B981',
      danger: '#EF4444',
      info: '#3B82F6',
      warning: '#F59E0B',
      light: '#FFFFFF',
      dark: '#1E3A8A',
      lightBg: '#FFFFFF',
      darkBg: '#1E3A8A',
      lightAccent: '#BFDBFE',
      darkAccent: '#DBEAFE',
    },
    green: {
      primary: '#10B981',
      secondary: '#64748B',
      accent: '#34D399',
      success: '#10B981',
      danger: '#EF4444',
      info: '#3B82F6',
      warning: '#F59E0B',
      light: '#FFFFFF',
      dark: '#064E3B',
      lightBg: '#FFFFFF',
      darkBg: '#064E3B',
      lightAccent: '#A7F3D0',
      darkAccent: '#D1FAE5',
    },
    purple: {
      primary: '#8B5CF6',
      secondary: '#64748B',
      accent: '#A78BFA',
      success: '#10B981',
      danger: '#EF4444',
      info: '#3B82F6',
      warning: '#F59E0B',
      light: '#FFFFFF',
      dark: '#4C1D95',
      lightBg: '#FFFFFF',
      darkBg: '#4C1D95',
      lightAccent: '#DDD6FE',
      darkAccent: '#EDE9FE',
    },
    pink: {
      primary: '#EC4899',
      secondary: '#64748B',
      accent: '#F472B6',
      success: '#10B981',
      danger: '#EF4444',
      info: '#3B82F6',
      warning: '#F59E0B',
      light: '#FFFFFF',
      dark: '#831843',
      lightBg: '#FFFFFF',
      darkBg: '#831843',
      lightAccent: '#FBCFE8',
      darkAccent: '#FCE7F3',
    },
  }
};

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme === 'dark';
  });

  const [colorScheme, setColorScheme] = useState(() => {
    const savedColorScheme = localStorage.getItem('colorScheme');
    return savedColorScheme || 'default';
  });

  // Get current theme colors based on color scheme and mode
  const getThemeColors = () => {
    const colors = themeOptions.colors[colorScheme];
    return {
      ...colors,
      current: {
        bg: isDarkMode ? colors.darkBg : colors.lightBg,
        text: isDarkMode ? colors.light : colors.dark,
        accent: isDarkMode ? colors.darkAccent : colors.lightAccent,
      }
    };
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('themeMode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('themeMode', 'light');
    }
    
    // Set CSS variables for the current theme
    const colors = themeOptions.colors[colorScheme];
    document.documentElement.style.setProperty('--color-primary', colors.primary);
    document.documentElement.style.setProperty('--color-secondary', colors.secondary);
    document.documentElement.style.setProperty('--color-accent', colors.accent);
    document.documentElement.style.setProperty('--color-success', colors.success);
    document.documentElement.style.setProperty('--color-danger', colors.danger);
    document.documentElement.style.setProperty('--color-info', colors.info);
    document.documentElement.style.setProperty('--color-warning', colors.warning);
    document.documentElement.style.setProperty('--color-light-accent', colors.lightAccent);
    document.documentElement.style.setProperty('--color-dark-accent', colors.darkAccent);
  }, [isDarkMode, colorScheme]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const changeColorScheme = (scheme) => {
    if (themeOptions.colors[scheme]) {
      setColorScheme(scheme);
      localStorage.setItem('colorScheme', scheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleTheme, 
      colorScheme, 
      changeColorScheme,
      themeColors: getThemeColors(),
      availableThemes: Object.keys(themeOptions.colors)
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

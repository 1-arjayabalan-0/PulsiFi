import React, { createContext, useContext } from 'react';
import theme from '../utils/theme';

// Create a context for the theme
const ThemeContext = createContext(theme);

/**
 * ThemeProvider component that makes the theme available throughout the app
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to access the theme
 * @returns {Object} The theme object
 */
export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
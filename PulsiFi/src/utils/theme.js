/**
 * PulseFi Theme Configuration
 * Centralized theme settings for consistent styling across the app
 */

export const colors = {
  // Primary brand colors
  primary: '#00d09e',
  primaryLight: '#00d09e20',
  secondary: '#097a77',
  secondaryLight: '#097a7720',
  tertiary: '#00a896',
  tertiaryLight: '#00a89620',
  
  // UI colors
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#FFFFFF',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  info: '#00a896',
  
  // Tab bar colors
  tabBarActive: '#00d09e',
  tabBarInactive: 'gray',
  tabBarBackground: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

// Export the complete theme object
const theme = {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
};

export default theme;
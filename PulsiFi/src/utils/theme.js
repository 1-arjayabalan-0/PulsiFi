/**
 * PulseFi Theme Configuration
 * Centralized theme settings for consistent styling across the app
 */

export const colors = {
  // Primary brand colors
  primary: '#4CAF50',
  primaryLight: '#4CAF5020',
  secondary: '#2196F3',
  secondaryLight: '#2196F320',
  tertiary: '#00a896',
  tertiaryLight: '#00a89620',
  
  // UI colors
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9500',
  info: '#2196F3',
  
  // Tab bar colors
  tabBarActive: '#4CAF50',
  tabBarInactive: '#757575',
  tabBarBackground: '#FFFFFF',
  
  // Chart colors
  chartBar: '#4CAF50',
  chartLine: '#2196F3',
  trendIncrease: '#4CAF50',
  trendDecrease: '#F44336',
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
    sm: 14, // body text
    md: 16, // button text
    lg: 18,
    xl: 20, // section header
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
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12, // Card radius (as per design requirements)
  lg: 16,
  xl: 24,
  round: 9999,
};

// Animation configurations
export const animations = {
  buttonPressRipple: true,
  tabSwitch: 'fade-slide',
  chartAnimation: {
    duration: 300,
    easing: 'ease-in',
  },
  transitions: {
    fast: 200,
    medium: 300,
    slow: 500,
  },
};

// Export the complete theme object
const theme = {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
  animations,
  
  // Component-specific styles
  components: {
    button: {
      padding: 16,
      radius: 12,
      textColor: '#FFFFFF',
    },
    card: {
      radius: 12,
      shadow: true,
      padding: 16,
    },
  },
};

export default theme;
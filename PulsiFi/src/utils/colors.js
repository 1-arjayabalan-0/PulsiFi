// Color palette for the new design
export const colors = {
  primary: '#00d09e', // Primary green
  primaryLight: '#00d09e80',
  primaryDark: '#00a07e',
  accent: '#097a77', // Secondary green
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  lightGray: '#E0E0E0',
  error: '#F44336',
  success: '#4CAF50',
  background: '#FFFFFF',
  inputBg: '#F5F5F5',
  textPrimary: '#212121',
  textSecondary: '#757575',
};

// Gradient configurations
export const gradients = {
  primary: {
    colors: ['#00d09e', '#097a77'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  accent: {
    colors: ['#097a77', '#00a07e'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  button: {
    colors: ['#00d09e', '#097a77'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

export default {
  colors,
  gradients,
};
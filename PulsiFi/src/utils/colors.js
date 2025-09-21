// Color palette for the new design
export const colors = {
  primary: '#5E35B1', // Deep purple
  primaryLight: '#7E57C2',
  primaryDark: '#4527A0',
  accent: '#00BCD4', // Cyan
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
    colors: ['#7E57C2', '#5E35B1'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  accent: {
    colors: ['#00BCD4', '#00ACC1'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  button: {
    colors: ['#00BCD4', '#00ACC1'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

export default {
  colors,
  gradients,
};
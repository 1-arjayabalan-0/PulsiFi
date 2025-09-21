import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';

/**
 * Text component with consistent styling based on theme
 * @param {Object} props - Component props
 * @param {string} props.variant - Text variant (h1, h2, h3, subtitle, body1, body2, caption, button)
 * @param {string} props.color - Text color (defaults to theme.colors.text)
 * @param {Object} props.style - Additional style for the text
 * @param {React.ReactNode} props.children - Child components
 */
const Text = ({
  variant = 'body1',
  color,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();
  
  // Determine text styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: theme.typography.fontSizes.xxxl,
          fontWeight: theme.typography.fontWeights.bold,
          lineHeight: theme.typography.fontSizes.xxxl * 1.2,
        };
      case 'h2':
        return {
          fontSize: theme.typography.fontSizes.xxl,
          fontWeight: theme.typography.fontWeights.bold,
          lineHeight: theme.typography.fontSizes.xxl * 1.2,
        };
      case 'h3':
        return {
          fontSize: theme.typography.fontSizes.xl,
          fontWeight: theme.typography.fontWeights.semiBold,
          lineHeight: theme.typography.fontSizes.xl * 1.2,
        };
      case 'subtitle':
        return {
          fontSize: theme.typography.fontSizes.lg,
          fontWeight: theme.typography.fontWeights.medium,
          lineHeight: theme.typography.fontSizes.lg * 1.2,
        };
      case 'body1':
        return {
          fontSize: theme.typography.fontSizes.md,
          fontWeight: theme.typography.fontWeights.regular,
          lineHeight: theme.typography.fontSizes.md * 1.5,
        };
      case 'body2':
        return {
          fontSize: theme.typography.fontSizes.sm,
          fontWeight: theme.typography.fontWeights.regular,
          lineHeight: theme.typography.fontSizes.sm * 1.5,
        };
      case 'caption':
        return {
          fontSize: theme.typography.fontSizes.xs,
          fontWeight: theme.typography.fontWeights.regular,
          lineHeight: theme.typography.fontSizes.xs * 1.5,
          color: theme.colors.textSecondary,
        };
      case 'button':
        return {
          fontSize: theme.typography.fontSizes.md,
          fontWeight: theme.typography.fontWeights.medium,
          lineHeight: theme.typography.fontSizes.md * 1.2,
        };
      default:
        return {
          fontSize: theme.typography.fontSizes.md,
          fontWeight: theme.typography.fontWeights.regular,
          lineHeight: theme.typography.fontSizes.md * 1.5,
        };
    }
  };

  return (
    <RNText
      style={[
        styles.text,
        getVariantStyles(),
        { color: color || theme.colors.text },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    // Base text styles
  },
});

export default Text;
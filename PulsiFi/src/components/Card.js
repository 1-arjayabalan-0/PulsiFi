import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';

/**
 * Card component with consistent styling
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.style - Additional style for the card
 * @param {string} props.variant - Card variant (default, flat, outlined)
 * @param {boolean} props.padded - Whether to add padding inside the card
 */
const Card = ({
  children,
  style,
  variant = 'default',
  padded = true,
  ...props
}) => {
  const theme = useTheme();
  
  // Determine card styles based on variant
  const getCardStyles = () => {
    switch (variant) {
      case 'flat':
        return {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.md,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.md,
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.md,
          ...theme.shadows.medium,
        };
    }
  };

  // Combine all styles
  const cardStyles = [
    styles.card,
    getCardStyles(),
    padded && { padding: theme.spacing.md },
    style,
  ];

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default Card;
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from './ThemeProvider';

/**
 * Enhanced Card component with modern styling and animation support
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {Object} props.style - Additional style for the card
 * @param {string} props.variant - Card variant (default, flat, outlined, gradient)
 * @param {boolean} props.padded - Whether to add padding inside the card
 * @param {boolean} props.animated - Whether to animate the card on mount
 * @param {Object} props.gradientColors - Colors for gradient variant
 */
const Card = ({
  children,
  style,
  variant = 'default',
  padded = true,
  animated = false,
  gradientColors,
  ...props
}) => {
  const theme = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0.9)).current;
  console.log("fadeAnim", fadeAnim);
  
  React.useEffect(() => {
    if (animated) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.animations.transitions.medium,
        useNativeDriver: true,
      }).start();
    }
  }, []);
  
  // Determine card styles based on variant
  const getCardStyles = () => {
    switch (variant) {
      case 'flat':
        return {
          backgroundColor: theme.colors.card,
          borderRadius: theme.components.card.radius,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.card,
          borderRadius: theme.components.card.radius,
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
      case 'gradient':
        return {
          borderRadius: theme.components.card.radius,
          // Gradient is applied via LinearGradient in the render method
        };
      case 'glass':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderRadius: theme.components.card.radius,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          ...theme.shadows.medium,
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.card,
          borderRadius: theme.components.card.radius,
          ...theme.shadows.medium,
        };
    }
  };

  // Combine all styles
  const cardStyles = [
    styles.card,
    getCardStyles(),
    padded && { padding: theme.components.card.padding },
    animated && { opacity: fadeAnim, transform: [{ scale: fadeAnim || 0 }] },
    style,
  ];

return (
    <Animated.View style={cardStyles} {...props}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default Card;
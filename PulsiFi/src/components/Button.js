import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated, View, Pressable } from 'react-native';
import { useTheme } from './ThemeProvider';

/**
 * Modern Button component with ripple effect and consistent styling
 * @param {Object} props - Component props
 * @param {string} props.title - Button text
 * @param {Function} props.onPress - Function to call when button is pressed
 * @param {string} props.variant - Button variant (primary, secondary, outline, text)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.loading - Whether to show a loading indicator
 * @param {boolean} props.ripple - Whether to show ripple effect
 * @param {Object} props.style - Additional style for the button
 * @param {Object} props.textStyle - Additional style for the button text
 */
const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  ripple = true,
  style,
  textStyle,
  ...props
}) => {
  const theme = useTheme();
  const [isPressed, setIsPressed] = React.useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  console.log("scaleAnim", scaleAnim);
  
  // Animation for button press
  const handlePressIn = () => {
    setIsPressed(true);
    if (ripple) {
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handlePressOut = () => {
    setIsPressed(false);
    if (ripple) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };
  
  // Determine button styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          borderColor: theme.colors.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary,
          borderWidth: 1,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      case 'primary':
      default:
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
    }
  };

  // Determine text styles based on variant
  const getTextStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          color: theme.colors.primary,
        };
      case 'text':
        return {
          color: theme.colors.primary,
        };
      case 'primary':
      case 'secondary':
      default:
        return {
          color: theme.components.button.textColor,
        };
    }
  };

  // Determine button size
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing.xs,
          paddingHorizontal: theme.spacing.md,
          borderRadius: theme.borderRadius.sm,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
          borderRadius: theme.borderRadius.lg,
        };
      case 'medium':
      default:
        return {
          paddingVertical: theme.components.button.padding / 2,
          paddingHorizontal: theme.components.button.padding,
          borderRadius: theme.components.button.radius,
        };
    }
  };

  // Determine text size
  const getTextSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: theme.typography.fontSizes.sm,
        };
      case 'large':
        return {
          fontSize: theme.typography.fontSizes.lg,
        };
      case 'medium':
      default:
        return {
          fontSize: theme.typography.fontSizes.md, // Button text size (16sp)
        };
    }
  };

  // Combine all styles
  const buttonStyles = [
    styles.button,
    getButtonStyles(),
    getSizeStyles(),
    disabled && styles.disabled,
    style,
    { transform: [{ scale: 1 }] },
  ];

  const textStyles = [
    styles.text,
    getTextStyles(),
    getTextSizeStyles(),
    disabled && styles.disabledText,
    textStyle,
  ];

  // Ripple effect component
  const RippleEffect = ({ isPressed }) => {
    if (!ripple || !isPressed) return null;
    
    return (
      <View style={[
        StyleSheet.absoluteFill,
        styles.rippleContainer,
        { borderRadius: getSizeStyles().borderRadius }
      ]}>
        <Animated.View style={[
          styles.ripple,
          { backgroundColor: variant === 'primary' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.05)' }
        ]} />
      </View>
    );
  };

  return (
    <Animated.View style={{ transform: [{ scale: 1 }] }}>
      <Pressable
        style={buttonStyles}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        android_ripple={ripple ? { color: 'rgba(255,255,255,0.2)' } : null}
        {...props}
      >
        <RippleEffect isPressed={isPressed} />
        {loading ? (
          <ActivityIndicator color={getTextStyles().color} size="small" />
        ) : (
          <Text style={textStyles}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  rippleContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
});

export default Button;
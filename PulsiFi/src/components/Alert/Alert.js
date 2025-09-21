import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../ThemeProvider';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

/**
 * Custom Alert Component with animations and theming
 */
const Alert = ({
  visible = false,
  type = 'info',
  title,
  message,
  onClose,
  autoClose = true,
  duration = 4000,
  buttons = [],
}) => {
  const theme = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      showAlert();
      if (autoClose) {
        const timer = setTimeout(() => {
          hideAlert();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      hideAlert();
    }
  }, [visible, autoClose, duration]);

  const showAlert = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideAlert = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  const getAlertConfig = () => {
    const configs = {
      success: {
        backgroundColor: theme.colors.success,
        icon: 'check-circle',
        iconColor: '#FFFFFF',
      },
      error: {
        backgroundColor: theme.colors.error,
        icon: 'error',
        iconColor: '#FFFFFF',
      },
      warning: {
        backgroundColor: theme.colors.warning,
        icon: 'warning',
        iconColor: '#FFFFFF',
      },
      info: {
        backgroundColor: theme.colors.info,
        icon: 'info',
        iconColor: '#FFFFFF',
      },
    };
    return configs[type] || configs.info;
  };

  const config = getAlertConfig();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.alertContainer,
          {
            backgroundColor: config.backgroundColor,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.alertContent}>
          <View style={styles.iconContainer}>
            <Icon
              name={config.icon}
              size={24}
              color={config.iconColor}
            />
          </View>
          
          <View style={styles.textContainer}>
            {title && (
              <Text style={[styles.title, { color: config.iconColor }]}>
                {title}
              </Text>
            )}
            <Text style={[styles.message, { color: config.iconColor }]}>
              {message}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={hideAlert}
          >
            <Icon name="close" size={20} color={config.iconColor} />
          </TouchableOpacity>
        </View>

        {buttons.length > 0 && (
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === 'destructive' && styles.destructiveButton,
                ]}
                onPress={() => {
                  if (button.onPress) button.onPress();
                  hideAlert();
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: config.iconColor },
                    button.style === 'destructive' && styles.destructiveButtonText,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  alertContainer: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: width - 40,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  destructiveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  destructiveButtonText: {
    fontWeight: '600',
  },
});

export default Alert;
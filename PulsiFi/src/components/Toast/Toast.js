import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useTheme } from '../ThemeProvider';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

/**
 * Toast Notification Component
 * Displays non-intrusive notifications at the top of the screen
 */
const Toast = ({
  visible = false,
  type = 'info',
  title,
  message,
  onClose,
  autoClose = true,
  duration = 4000,
  position = 'top', // 'top' or 'bottom'
}) => {
  const theme = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));
  const [panY] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      showToast();
      if (autoClose) {
        const timer = setTimeout(() => {
          hideToast();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      hideToast();
    }
  }, [visible, autoClose, duration]);

  const showToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: position === 'top' ? -100 : 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      panY.setValue(0);
      if (onClose) onClose();
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: panY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
      
      // If swiped up significantly or with high velocity, dismiss
      if (
        (position === 'top' && (translationY < -50 || velocityY < -500)) ||
        (position === 'bottom' && (translationY > 50 || velocityY > 500))
      ) {
        hideToast();
      } else {
        // Spring back to original position
        Animated.spring(panY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const getTypeConfig = () => {
    const configs = {
      success: {
        icon: 'check-circle',
        backgroundColor: theme.colors.success || '#4CAF50',
        iconColor: '#FFFFFF',
      },
      error: {
        icon: 'error',
        backgroundColor: theme.colors.error || '#F44336',
        iconColor: '#FFFFFF',
      },
      warning: {
        icon: 'warning',
        backgroundColor: theme.colors.warning || '#FF9800',
        iconColor: '#FFFFFF',
      },
      info: {
        icon: 'info',
        backgroundColor: theme.colors.info || '#2196F3',
        iconColor: '#FFFFFF',
      },
    };
    return configs[type] || configs.info;
  };

  const typeConfig = getTypeConfig();

  if (!visible) return null;

  return (
    <View style={[styles.container, position === 'bottom' && styles.bottomContainer]}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.toastContainer,
            {
              backgroundColor: typeConfig.backgroundColor,
              opacity: fadeAnim,
              transform: [
                { translateY: Animated.add(slideAnim, panY) },
              ],
            },
          ]}
        >
          <View style={styles.toastContent}>
            <View style={styles.iconContainer}>
              <Icon
                name={typeConfig.icon}
                size={24}
                color={typeConfig.iconColor}
              />
            </View>
            
            <View style={styles.textContainer}>
              {title && (
                <Text style={[styles.title, { color: typeConfig.iconColor }]}>
                  {title}
                </Text>
              )}
              {message && (
                <Text style={[styles.message, { color: typeConfig.iconColor }]}>
                  {message}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={hideToast}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name="close"
                size={20}
                color={typeConfig.iconColor}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  bottomContainer: {
    top: 'auto',
    bottom: 50,
  },
  toastContainer: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: width - 32,
  },
  toastContent: {
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
    opacity: 0.9,
  },
  closeButton: {
    padding: 4,
    marginTop: -2,
  },
});

export default Toast;
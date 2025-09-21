import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../ThemeProvider';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

/**
 * Confirmation Dialog Component
 * Used for actions that require user confirmation
 */
const ConfirmDialog = ({
  visible = false,
  type = 'warning',
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
}) => {
  const theme = useTheme();

  const getTypeConfig = () => {
    const configs = {
      warning: {
        icon: 'warning',
        iconColor: theme.colors.warning || '#FF9800',
      },
      error: {
        icon: 'error',
        iconColor: theme.colors.error || '#F44336',
      },
      info: {
        icon: 'info',
        iconColor: theme.colors.info || '#2196F3',
      },
    };
    return configs[type] || configs.warning;
  };

  const typeConfig = getTypeConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.dialogContainer,
          { backgroundColor: theme.colors.surface || '#FFFFFF' }
        ]}>
          <View style={styles.header}>
            <Icon
              name={typeConfig.icon}
              size={32}
              color={typeConfig.iconColor}
              style={styles.icon}
            />
            {title && (
              <Text style={[
                styles.title,
                { color: theme.colors.onSurface || '#000000' }
              ]}>
                {title}
              </Text>
            )}
          </View>

          {message && (
            <Text style={[
              styles.message,
              { color: theme.colors.onSurface || '#666666' }
            ]}>
              {message}
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
                { borderColor: theme.colors.outline || '#E0E0E0' }
              ]}
              onPress={onCancel}
            >
              <Text style={[
                styles.buttonText,
                { color: theme.colors.onSurface || '#666666' }
              ]}>
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                {
                  backgroundColor: destructive
                    ? (theme.colors.error || '#F44336')
                    : (theme.colors.primary || '#2196F3')
                }
              ]}
              onPress={onConfirm}
            >
              <Text style={[
                styles.buttonText,
                styles.confirmButtonText,
                { color: '#FFFFFF' }
              ]}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dialogContainer: {
    borderRadius: 16,
    padding: 24,
    maxWidth: width - 40,
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    // backgroundColor set dynamically
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButtonText: {
    fontWeight: '600',
  },
});

export default ConfirmDialog;
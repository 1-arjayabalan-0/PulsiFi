import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAlert } from '../context/AlertContext';
import { useTheme } from '../components/ThemeProvider';
import AlertService from '../utils/alert';

const ToastTestScreen = () => {
  const theme = useTheme();
  const alert = useAlert();

  const testToasts = [
    {
      title: 'Success Toast (Hook)',
      action: () => alert.success('Operation completed successfully!', 'Success'),
      color: theme.colors.success,
    },
    {
      title: 'Error Toast (Hook)',
      action: () => alert.error('Something went wrong!', 'Error'),
      color: theme.colors.error,
    },
    {
      title: 'Warning Toast (Hook)',
      action: () => alert.warning('Please check your input!', 'Warning'),
      color: theme.colors.warning,
    },
    {
      title: 'Info Toast (Hook)',
      action: () => alert.info('Here is some information for you.', 'Information'),
      color: theme.colors.info,
    },
    {
      title: 'Success Toast (Service)',
      action: () => AlertService.success('Service success message!'),
      color: theme.colors.success,
    },
    {
      title: 'Error Toast (Service)',
      action: () => AlertService.error('Service error message!'),
      color: theme.colors.error,
    },
    {
      title: 'Confirm Dialog',
      action: () => alert.confirm(
        'Are you sure you want to proceed?',
        () => alert.success('Confirmed!'),
        'Confirmation'
      ),
      color: theme.colors.warning,
    },
    {
      title: 'Destructive Confirm',
      action: () => alert.confirmDestructive(
        'This action cannot be undone. Are you sure?',
        () => alert.success('Deleted!'),
        'Delete Item'
      ),
      color: theme.colors.error,
    },
    {
      title: 'API Response Test',
      action: () => alert.handleApiResponse({
        success: true,
        message: 'Data saved successfully!'
      }),
      color: theme.colors.info,
    },
    {
      title: 'Network Error Test',
      action: () => alert.networkError(),
      color: theme.colors.error,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Toast Notification Test
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Test all toast types and confirm dialogs
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {testToasts.map((test, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.testButton,
              { 
                backgroundColor: test.color,
                borderColor: test.color,
              }
            ]}
            onPress={test.action}
          >
            <Text style={styles.buttonText}>{test.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
          Tap any button to test the corresponding toast notification or dialog.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  testButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 30,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ToastTestScreen;
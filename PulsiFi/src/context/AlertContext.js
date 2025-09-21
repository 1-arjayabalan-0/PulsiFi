import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    autoClose: true,
    duration: 4000,
  });

  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    type: 'warning',
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    destructive: false,
  });

  const showAlert = ({
    type = 'info',
    title = '',
    message = '',
    autoClose = true,
    duration = 4000,
  }) => {
    setAlert({
      visible: true,
      type,
      title,
      message,
      autoClose,
      duration,
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, visible: false }));
  };

  const showConfirm = ({
    type = 'warning',
    title = '',
    message = '',
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    destructive = false,
  }) => {
    setConfirmDialog({
      visible: true,
      type,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      destructive,
    });
  };

  const hideConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, visible: false }));
  };

  const success = (message, title = 'Success', options = {}) => {
    showAlert({
      type: 'success',
      title,
      message,
      ...options,
    });
  };

  const error = (message, title = 'Error', options = {}) => {
    showAlert({
      type: 'error',
      title,
      message,
      autoClose: false,
      ...options,
    });
  };

  const warning = (message, title = 'Warning', options = {}) => {
    showAlert({
      type: 'warning',
      title,
      message,
      ...options,
    });
  };

  const info = (message, title = 'Information', options = {}) => {
    showAlert({
      type: 'info',
      title,
      message,
      ...options,
    });
  };

  const confirm = (message, onConfirm, title = 'Confirm', options = {}) => {
    showConfirm({
      type: 'warning',
      title,
      message,
      onConfirm: () => {
        hideConfirm();
        onConfirm();
      },
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      ...options,
    });
  };

  const confirmDestructive = (message, onConfirm, title = 'Confirm', options = {}) => {
    showConfirm({
      type: 'error',
      title,
      message,
      onConfirm: () => {
        hideConfirm();
        onConfirm();
      },
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
      ...options,
    });
  };

  const handleApiResponse = (response, successMessage = null) => {
    if (response.success) {
      const message = successMessage || response.message || 'Operation completed successfully';
      success(message);
    } else {
      const message = response.message || 'An error occurred';
      error(message);
    }
  };

  const handleApiError = (err, defaultMessage = 'Something went wrong') => {
    const message = err.message || defaultMessage;
    error(message);
  };

  const networkError = () => {
    error(
      'Please check your internet connection and try again.',
      'Network Error'
    );
  };

  const timeoutError = () => {
    error(
      'The request took too long to complete. Please try again.',
      'Request Timeout'
    );
  };

  const serverError = () => {
    error(
      'Server is currently unavailable. Please try again later.',
      'Server Error'
    );
  };

  const value = {
    showAlert,
    hideAlert,
    showConfirm,
    hideConfirm,
    success,
    error,
    warning,
    info,
    confirm,
    confirmDestructive,
    handleApiResponse,
    handleApiError,
    networkError,
    timeoutError,
    serverError,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <Toast
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        autoClose={alert.autoClose}
        duration={alert.duration}
        onClose={hideAlert}
      />
      <ConfirmDialog
        visible={confirmDialog.visible}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={hideConfirm}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        destructive={confirmDialog.destructive}
      />
    </AlertContext.Provider>
  );
};

export default AlertContext;
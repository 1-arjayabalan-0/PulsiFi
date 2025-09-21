// This file is deprecated. Use AlertContext (useAlert hook) instead.
// Keeping for backward compatibility during migration.

import { useAlert } from '../context/AlertContext';

/**
 * Alert types enum
 */
export const AlertType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * Alert utility class for showing different types of alerts
 * @deprecated Use useAlert hook from AlertContext instead
 */
class AlertService {
  // Static reference to alert context methods
  static alertMethods = null;

  /**
   * Initialize AlertService with context methods
   * This should be called from App component after AlertProvider is mounted
   */
  static init(alertMethods) {
    this.alertMethods = alertMethods;
  }

  /**
   * Show a success alert
   * @param {string} message - Alert message
   * @param {string} title - Optional custom title
   * @param {Object} options - Additional options
   */
  static success(message, title = 'Success', options = {}) {
    if (this.alertMethods) {
      this.alertMethods.success(message, title, options);
    } else {
      console.warn('AlertService not initialized. Use useAlert hook instead.');
    }
  }

  /**
   * Show an error alert
   * @param {string} message - Alert message
   * @param {string} title - Optional custom title
   * @param {Object} options - Additional options
   */
  static error(message, title = 'Error', options = {}) {
    if (this.alertMethods) {
      this.alertMethods.error(message, title, options);
    } else {
      console.warn('AlertService not initialized. Use useAlert hook instead.');
    }
  }

  /**
   * Show a warning alert
   * @param {string} message - Alert message
   * @param {string} title - Optional custom title
   * @param {Object} options - Additional options
   */
  static warning(message, title = 'Warning', options = {}) {
    if (this.alertMethods) {
      this.alertMethods.warning(message, title, options);
    } else {
      console.warn('AlertService not initialized. Use useAlert hook instead.');
    }
  }

  /**
   * Show an info alert
   * @param {string} message - Alert message
   * @param {string} title - Optional custom title
   * @param {Object} options - Additional options
   */
  static info(message, title = 'Information', options = {}) {
    if (this.alertMethods) {
      this.alertMethods.info(message, title, options);
    } else {
      console.warn('AlertService not initialized. Use useAlert hook instead.');
    }
  }

  /**
   * Show a confirmation alert
   * @param {string} message - Alert message
   * @param {Function} onConfirm - Callback for confirm action
   * @param {Function} onCancel - Callback for cancel action
   * @param {string} title - Optional custom title
   */
  static confirm(message, onConfirm, onCancel = null, title = 'Confirm') {
    if (this.alertMethods) {
      this.alertMethods.confirm(message, onConfirm, title);
    } else {
      console.warn('AlertService not initialized. Use useAlert hook instead.');
    }
  }

  /**
   * Show a destructive confirmation alert
   * @param {string} message - Alert message
   * @param {Function} onConfirm - Callback for confirm action
   * @param {Function} onCancel - Callback for cancel action
   * @param {string} title - Optional custom title
   */
  static confirmDestructive(message, onConfirm, onCancel = null, title = 'Confirm') {
    if (this.alertMethods) {
      this.alertMethods.confirmDestructive(message, onConfirm, title);
    } else {
      console.warn('AlertService not initialized. Use useAlert hook instead.');
    }
  }

  /**
   * Show alert based on API response
   * @param {Object} response - API response object
   * @param {string} successMessage - Optional success message override
   */
  static handleApiResponse(response, successMessage = null) {
    if (this.alertMethods) {
      this.alertMethods.handleApiResponse(response, successMessage);
    } else {
      console.warn('AlertService not initialized. Use useAlert hook instead.');
    }
  }

  /**
   * Show alert for API errors
   * @param {Error} error - Error object
   * @param {string} defaultMessage - Default error message
   */
  static handleApiError(error, defaultMessage = 'Something went wrong') {
    if (this.alertMethods) {
      this.alertMethods.handleApiError(error, defaultMessage);
    } else {
      console.warn('AlertService not initialized. Use useAlert hook instead.');
    }
  }

  /**
   * Show network error alert
   */
  static networkError() {
    if (this.alertMethods) {
      this.alertMethods.networkError();
    } else {
      console.warn('AlertService not initialized. Use useAlert hook instead.');
    }
  }

  /**
   * Show timeout error alert
   */
  static timeoutError() {
    if (this.alertMethods) {
      this.alertMethods.timeoutError();
    } else {
      console.warn('AlertService not initialized. Use useAlert hook instead.');
    }
  }

  /**
   * Show server error alert
   */
  static serverError() {
    if (this.alertMethods) {
      this.alertMethods.serverError();
    } else {
      console.warn('AlertService not initialized. Use useAlert hook instead.');
    }
  }

  /**
   * Show a simple alert with just OK button
   * @param {string} title - Alert title
   * @param {string} message - Alert message
   */
  static simple(title, message) {
    if (this.alertMethods) {
      this.alertMethods.info(message, title);
    } else {
      console.warn('AlertService not initialized. Use useAlert hook instead.');
    }
  }
}

export default AlertService;
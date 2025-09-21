import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertService from '../utils/alert';
import { Platform } from 'react-native';
import { API_URL, API_URL_ANDROID } from '@env';

// Global reference to auth context for logout functionality
let authContextRef = null;

// Function to set auth context reference
export const setAuthContext = (authContext) => {
  authContextRef = authContext;
};

// API base URL - using environment variables
const BASE_API_URL = Platform.OS === 'android' 
  ? API_URL_ANDROID 
  : API_URL;

/**
 * Handles API requests with authentication
 */
class ApiService {
  /**
   * Make a request to the API
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @param {boolean} showAlerts - Whether to show alerts for errors (default: true)
   * @returns {Promise<any>} Response data
   */
  static async request(endpoint, options = {}, showAlerts = true) {
    const url = `${BASE_API_URL}${endpoint}`;
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle token expiration
      if (response.status === 401 && data.error?.code === 'TOKEN_EXPIRED') {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request with new token
          return this.request(endpoint, options, showAlerts);
        } else {
          // Token refresh failed, logout user and redirect to login
          if (authContextRef && authContextRef.logout) {
            await authContextRef.logout();
          } else {
            // Fallback: clear tokens manually
            await this.clearTokens();
          }
          
          if (showAlerts) {
            AlertService.error('Your session has expired. Please log in again.');
          }
          throw new Error('Session expired');
        }
      }

      // Handle general 401 errors (token expired without specific error code)
      if (response.status === 401) {
        // Token is invalid or expired, logout user
        if (authContextRef && authContextRef.logout) {
          await authContextRef.logout();
        } else {
          // Fallback: clear tokens manually
          await this.clearTokens();
        }
        
        if (showAlerts) {
          AlertService.error('Your session has expired. Please log in again.');
        }
        throw new Error('Token expired');
      }

      if (!response.ok) {
        const errorMessage = data.message || 'API request failed';
        if (showAlerts) {
          // Handle different error types
          if (response.status >= 500) {
            AlertService.serverError();
          } else if (response.status === 404) {
            AlertService.error('The requested resource was not found.');
          } else if (response.status === 403) {
            AlertService.error('You do not have permission to perform this action.');
          } else {
            AlertService.error(errorMessage);
          }
        }
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      
      if (showAlerts) {
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
          AlertService.networkError();
        } else if (error.name === 'AbortError' || error.message.includes('timeout')) {
          AlertService.timeoutError();
        } else if (!error.message.includes('Session expired') && !error.message.includes('Token expired')) {
          // Don't show alert for session/token expired as it's already handled above
          AlertService.handleApiError(error);
        }
      }
      
      throw error;
    }
  }

  /**
   * Refresh the access token using refresh token
   * @returns {Promise<boolean>} Success status
   */
  static async refreshToken() {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: refreshToken }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // If refresh fails, log out the user
        await this.clearTokens();
        return false;
      }

      // Save new tokens
      await AsyncStorage.setItem('accessToken', data.data.tokens.accessToken);
      await AsyncStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      
      // If refresh fails, logout the user automatically
      if (authContextRef && authContextRef.logout) {
        await authContextRef.logout();
      } else {
        // Fallback: clear tokens manually
        await this.clearTokens();
      }
      
      return false;
    }
  }

  /**
   * Clear stored tokens
   */
  static async clearTokens() {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {boolean} showAlerts - Whether to show alerts for errors
   * @returns {Promise<any>} Response data
   */
  static async get(endpoint, showAlerts = true) {
    return this.request(endpoint, { method: 'GET' }, showAlerts);
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {boolean} showAlerts - Whether to show alerts for errors
   * @returns {Promise<any>} Response data
   */
  static async post(endpoint, data = {}, showAlerts = true) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, showAlerts);
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body data
   * @param {boolean} showAlerts - Whether to show alerts for errors
   * @returns {Promise<any>} Response data
   */
  static async put(endpoint, data = {}, showAlerts = true) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, showAlerts);
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {boolean} showAlerts - Whether to show alerts for errors
   * @returns {Promise<any>} Response data
   */
  static async delete(endpoint, showAlerts = true) {
    return this.request(endpoint, { method: 'DELETE' }, showAlerts);
  }
}

export default ApiService;
import ApiService from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Authentication service for handling user authentication
 */
class AuthService {
  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name
   * @returns {Promise<Object>} Registration result
   */
  static async register(email, password, name) {
    try {
      const response = await ApiService.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      
      if (response.success) {
        await this.saveTokens(response.data.tokens);
        return { success: true, user: response.data.user };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  }

  /**
   * Login a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login result
   */
  static async login(email, password) {
    try {
      const response = await ApiService.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.success) {
        await this.saveTokens(response.data.tokens);
        return { success: true, user: response.data.user };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  }

  /**
   * Logout the current user
   * @returns {Promise<void>}
   */
  static async logout() {
    try {
      // Call logout endpoint if needed
      await ApiService.request('/auth/logout', {
        method: 'POST',
      }).catch(() => {
        // Ignore errors on logout
      });
    } finally {
      // Always clear tokens regardless of API response
      await ApiService.clearTokens();
    }
  }

  /**
   * Save authentication tokens
   * @param {Object} tokens - Auth tokens
   * @param {string} tokens.accessToken - JWT access token
   * @param {string} tokens.refreshToken - JWT refresh token
   * @returns {Promise<void>}
   */
  static async saveTokens({ accessToken, refreshToken }) {
    await AsyncStorage.multiSet([
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
    ]);
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} Authentication status
   */
  static async isAuthenticated() {
    const token = await AsyncStorage.getItem('accessToken');
    return !!token;
  }

  /**
   * Get current user data
   * @returns {Promise<Object|null>} User data or null if not authenticated
   */
  static async getCurrentUser() {
    try {
      const response = await ApiService.request('/auth/me', {
        method: 'GET',
      });
      
      return response.success ? response.data.user : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }
}

export default AuthService;
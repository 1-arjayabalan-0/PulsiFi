import ApiService from './api';
import AlertService from '../utils/alert';

/**
 * Account service for managing account-related API calls
 */
class AccountService {
  /**
   * Create a new account
   * @param {Object} accountData - Account data
   * @param {string} accountData.name - Account name
   * @param {string} accountData.type - Account type (cash_wallet, bank_account, etc.)
   * @param {number} accountData.balance - Initial balance (default: 0)
   * @param {string} accountData.portfolioId - Portfolio ID
   * @param {string} accountData.parentId - Parent account ID (optional, for sub-accounts)
   * @returns {Promise<Object>} Created account data
   */
  static async createAccount(accountData) {
    try {
      // Remove currency from accountData as we'll use portfolio's currency
      const { currency, ...accountDataWithoutCurrency } = accountData;
      const response = await ApiService.post('/accounts', accountDataWithoutCurrency);
      
      if (response.success) {
        // Don't show success alert here - let the calling function handle it
        // AlertService.success('Account created successfully!');
        return response.data.account;
      } else {
        throw new Error(response.message || 'Failed to create account');
      }
    } catch (error) {
      console.error('Create account error:', error);
      const errorMessage = error.message || 'Failed to create account';
      
      // Check if the error message contains success indicators (backend bug)
      const isActuallySuccess = errorMessage.toLowerCase().includes('created successfully') || 
                               errorMessage.toLowerCase().includes('account created');
      
      if (isActuallySuccess) {
        // This is actually a success response with wrong error format
        console.warn('Backend returned success message as error:', errorMessage);
        // Return a mock successful account object
        return {
          id: Date.now().toString(), // temporary ID
          name: accountData.name,
          type: accountData.type,
          balance: accountData.balance || 0,
          portfolioId: accountData.portfolioId
        };
      } else {
        AlertService.error(errorMessage);
        throw error;
      }
    }
  }

  /**
   * Get all accounts for a specific portfolio
   * @param {string} portfolioId - Portfolio ID
   * @returns {Promise<Array>} Array of accounts
   */
  static async getAccountsByPortfolio(portfolioId) {
    try {
      const response = await ApiService.get(`/accounts/portfolio/${portfolioId}`);
      
      if (response.success) {
        return response.data.accounts || [];
      } else {
        throw new Error(response.message || 'Failed to fetch accounts');
      }
    } catch (error) {
      console.error('Get accounts error:', error);
      const errorMessage = error.message || 'Failed to fetch accounts';
      AlertService.error(errorMessage);
      throw error;
    }
  }

  /**
   * Get a specific account by ID
   * @param {string} accountId - Account ID
   * @returns {Promise<Object>} Account data
   */
  static async getAccountById(accountId) {
    try {
      const response = await ApiService.get(`/accounts/${accountId}`);
      
      if (response.success) {
        return response.data.account;
      } else {
        throw new Error(response.message || 'Failed to fetch account');
      }
    } catch (error) {
      console.error('Get account error:', error);
      const errorMessage = error.message || 'Failed to fetch account';
      AlertService.error(errorMessage);
      throw error;
    }
  }

  /**
   * Update an account
   * @param {string} accountId - Account ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated account data
   */
  static async updateAccount(accountId, updateData) {
    try {
      const response = await ApiService.put(`/accounts/${accountId}`, updateData);
      
      if (response.success) {
        AlertService.success('Account updated successfully!');
        return response.data.account;
      } else {
        throw new Error(response.message || 'Failed to update account');
      }
    } catch (error) {
      console.error('Update account error:', error);
      const errorMessage = error.message || 'Failed to update account';
      AlertService.error(errorMessage);
      throw error;
    }
  }

  /**
   * Delete an account
   * @param {string} accountId - Account ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteAccount(accountId) {
    try {
      const response = await ApiService.delete(`/accounts/${accountId}`);
      
      if (response.success) {
        AlertService.success('Account deleted successfully!');
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      const errorMessage = error.message || 'Failed to delete account';
      AlertService.error(errorMessage);
      throw error;
    }
  }

  /**
   * Get all accounts for the current user (across all portfolios)
   * @returns {Promise<Array>} Array of user accounts
   */
  static async getUserAccounts() {
    try {
      const response = await ApiService.get('/accounts');
      
      // Handle multiple response formats
      if (response && response.accounts) {
        // Direct accounts array
        return response.accounts;
      } else if (response && response.success && response.data?.accounts) {
        // Standard success response format
        return response.data.accounts;
      } else if (response && response.data?.accounts) {
        // Data wrapper without success flag
        return response.data.accounts;
      } else {
        // Fallback - return empty array
        return [];
      }
    } catch (error) {
      console.error('Get user accounts error:', error);
      // Return empty array as fallback instead of throwing
      return [];
    }
  }

  /**
   * Get all accounts for the current user (alias for getUserAccounts)
   * @returns {Promise<Array>} Array of user accounts
   */
  static async getAllAccounts() {
    return this.getUserAccounts();
  }
}

export default AccountService;
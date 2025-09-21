import ApiService from './api';
import AlertService from '../utils/alert';

/**
 * Transaction service for managing transaction-related API calls
 */
class TransactionService {
  /**
   * Create a new transaction
   * @param {Object} transactionData - Transaction data
   * @param {string} transactionData.type - Transaction type ('income' or 'expense')
   * @param {number} transactionData.amount - Transaction amount
   * @param {string} transactionData.category - Transaction category
   * @param {string} transactionData.description - Transaction description
   * @param {string} transactionData.date - Transaction date
   * @param {string} transactionData.accountId - Account ID
   * @returns {Promise<Object>} Created transaction data
   */
  static async createTransaction(transactionData) {
    try {
      const response = await ApiService.post('/transactions', transactionData);
      
      // Check if response has transaction data (success case)
      if (response && response.transaction) {
        return response.transaction;
      }
      
      // Check if response has success flag
      if (response && response.success) {
        return response.data?.transaction || response;
      }
      
      // If no clear success indicators, throw error
      throw new Error(response?.message || 'Failed to create transaction');
    } catch (error) {
      console.error('Create transaction error:', error);
      const errorMessage = error.message || 'Failed to create transaction';
      
      // Check if the error message contains success indicators (backend bug)
      const isActuallySuccess = errorMessage.toLowerCase().includes('created successfully') || 
                               errorMessage.toLowerCase().includes('transaction created');
      
      if (isActuallySuccess) {
        // This is actually a success response with wrong error format
        console.warn('Backend returned success message as error:', errorMessage);
        // Return a mock successful transaction object
        return {
          id: Date.now().toString(), // temporary ID
          type: transactionData.type,
          amount: transactionData.amount,
          category: transactionData.category,
          description: transactionData.description,
          date: transactionData.date,
          accountId: transactionData.accountId
        };
      } else {
        AlertService.error(errorMessage);
        throw error;
      }
    }
  }

  /**
   * Get all transactions for the current user
   * @returns {Promise<Array>} Array of transaction objects
   */
  static async getAllTransactions() {
    try {
      const response = await ApiService.get('/transactions');
      console.log('Transactions API response:', response); // Debug log
      
      // Handle multiple response formats
      if (response && response.success && response.data?.transactions) {
        // Standard success response format from backend
        return response.data.transactions;
      } else if (response && response.transactions) {
        // Direct transactions array
        return response.transactions;
      } else if (response && response.data?.transactions) {
        // Data wrapper without success flag
        return response.data.transactions;
      } else if (Array.isArray(response)) {
        // Direct array response
        return response;
      } else {
        console.log('No transactions found in response:', response);
        // Fallback - return empty array
        return [];
      }
    } catch (error) {
      console.error('Get transactions error:', error);
      // Return empty array as fallback instead of throwing
      return [];
    }
  }

  /**
   * Get transactions by account ID
   * @param {string} accountId - Account ID
   * @returns {Promise<Array>} Array of transaction objects
   */
  static async getTransactionsByAccount(accountId) {
    try {
      const response = await ApiService.get(`/transactions/account/${accountId}`);
      
      if (response.success) {
        return response.data.transactions || [];
      } else {
        throw new Error(response.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Get transactions by account error:', error);
      return [];
    }
  }

  /**
   * Get transaction by ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Transaction object
   */
  static async getTransactionById(transactionId) {
    try {
      const response = await ApiService.get(`/transactions/${transactionId}`);
      
      if (response.success) {
        return response.data.transaction;
      } else {
        throw new Error(response.message || 'Transaction not found');
      }
    } catch (error) {
      console.error('Get transaction by ID error:', error);
      AlertService.error(error.message || 'Failed to fetch transaction');
      throw error;
    }
  }

  /**
   * Update a transaction
   * @param {string} transactionId - Transaction ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated transaction data
   */
  static async updateTransaction(transactionId, updateData) {
    try {
      const response = await ApiService.put(`/transactions/${transactionId}`, updateData);
      
      if (response.success) {
        return response.data.transaction;
      } else {
        throw new Error(response.message || 'Failed to update transaction');
      }
    } catch (error) {
      console.error('Update transaction error:', error);
      AlertService.error(error.message || 'Failed to update transaction');
      throw error;
    }
  }

  /**
   * Delete a transaction
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteTransaction(transactionId) {
    try {
      const response = await ApiService.delete(`/transactions/${transactionId}`);
      
      if (response.success) {
        AlertService.success('Transaction deleted successfully!');
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error('Delete transaction error:', error);
      AlertService.error(error.message || 'Failed to delete transaction');
      throw error;
    }
  }

  /**
   * Get recent transactions (limited number)
   * @param {number} limit - Number of transactions to fetch (default: 10)
   * @returns {Promise<Array>} Array of recent transaction objects
   */
  static async getRecentTransactions(limit = 10) {
    try {
      const response = await ApiService.get(`/transactions/recent?limit=${limit}`);
      
      if (response.success) {
        return response.data.transactions || [];
      } else {
        throw new Error(response.message || 'Failed to fetch recent transactions');
      }
    } catch (error) {
      console.error('Get recent transactions error:', error);
      return [];
    }
  }

  /**
   * Get all transactions for the current user (alias for getAllTransactions)
   * @returns {Promise<Array>} Array of transaction objects
   */
  static async getUserTransactions() {
    return this.getAllTransactions();
  }
}

export default TransactionService;
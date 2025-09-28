import ApiService from './api';
import AlertService from '../utils/alert';

/**
 * Portfolio service for managing portfolio-related API calls
 */
class PortfolioService {
  /**
   * Create a new portfolio
   * @param {Object} portfolioData - Portfolio data
   * @param {string} portfolioData.name - Portfolio name
   * @param {string} portfolioData.currencyId - Portfolio currency ID
   * @returns {Promise<Object>} Created portfolio data
   */
  static async createPortfolio(portfolioData) {
    try {
      const response = await ApiService.post('/portfolios', portfolioData);
      
      if (response.success) {
        AlertService.success('Portfolio created successfully!');
        return response.data.portfolio;
      } else {
        throw new Error(response.message || 'Failed to create portfolio');
      }
    } catch (error) {
      console.error('Create portfolio error:', error);
      const errorMessage = error.message || 'Failed to create portfolio';
      AlertService.error(errorMessage);
      throw error;
    }
  }

  /**
   * Get all portfolios for the current user
   * @returns {Promise<Array>} Array of user portfolios
   */
  static async getUserPortfolios() {
    try {
      const response = await ApiService.get('/portfolios');
      
      // Handle both old and new response formats
      if (response && response.portfolios) {
        // Direct portfolios array (old format)
        return response.portfolios;
      } else if (response && response.success && response.data?.portfolios) {
        // Standard success response format
        return response.data.portfolios;
      } else if (response && response.data?.portfolios) {
        // Data wrapper without success flag
        return response.data.portfolios;
      } else {
        // Fallback - return empty array
        return [];
      }
    } catch (error) {
      console.error('Get portfolios error:', error);
      // Don't show alert for portfolio errors to avoid blocking the app
      // Just return empty array as fallback
      return [];
    }
  }

  /**
   * Get a specific portfolio by ID
   * @param {string} portfolioId - Portfolio ID
   * @returns {Promise<Object>} Portfolio data
   */
  static async getPortfolioById(portfolioId) {
    try {
      const response = await ApiService.get(`/portfolios/${portfolioId}`);
      
      if (response.success) {
        return response.data.portfolio;
      } else {
        throw new Error(response.message || 'Failed to fetch portfolio');
      }
    } catch (error) {
      console.error('Get portfolio error:', error);
      const errorMessage = error.message || 'Failed to fetch portfolio';
      AlertService.error(errorMessage);
      throw error;
    }
  }

  /**
   * Update a portfolio
   * @param {string} portfolioId - Portfolio ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated portfolio data
   */
  static async updatePortfolio(portfolioId, updateData) {
    try {
      const response = await ApiService.put(`/portfolios/${portfolioId}`, updateData);
      
      if (response.success) {
        AlertService.success('Portfolio updated successfully!');
        return response.data.portfolio;
      } else {
        throw new Error(response.message || 'Failed to update portfolio');
      }
    } catch (error) {
      console.error('Update portfolio error:', error);
      const errorMessage = error.message || 'Failed to update portfolio';
      AlertService.error(errorMessage);
      throw error;
    }
  }

  /**
   * Delete a portfolio
   * @param {string} portfolioId - Portfolio ID
   * @returns {Promise<boolean>} Success status
   */
  static async deletePortfolio(portfolioId) {
    try {
      const response = await ApiService.delete(`/portfolios/${portfolioId}`);
      
      if (response.success) {
        AlertService.success('Portfolio deleted successfully!');
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete portfolio');
      }
    } catch (error) {
      console.error('Delete portfolio error:', error);
      const errorMessage = error.message || 'Failed to delete portfolio';
      AlertService.error(errorMessage);
      throw error;
    }
  }

  /**
   * Create a portfolio with a default cash account
   * @param {Object} portfolioData - Portfolio data
   * @param {string} portfolioData.name - Portfolio name
   * @param {string} portfolioData.currency - Portfolio currency
   * @param {boolean} portfolioData.createDefaultAccount - Whether to create default account
   * @param {string} portfolioData.defaultAccountName - Default account name (optional)
   * @returns {Promise<Object>} Created portfolio with default account
   */
  static async createPortfolioWithDefaultAccount(portfolioData) {
    try {
      const { name, currency, createDefaultAccount = true, defaultAccountName = 'Cash Wallet' } = portfolioData;
      
      // First create the portfolio
      const portfolio = await this.createPortfolio({ name, currency });
      
      if (portfolio && createDefaultAccount) {
        // Import AccountService dynamically to avoid circular dependency
        const AccountService = (await import('./account')).default;
        
        // Create default cash account
        const defaultAccountData = {
          name: defaultAccountName,
          type: 'cash_wallet',
          balance: 0,
          currency: currency,
          portfolioId: portfolio.id
        };
        
        try {
          const defaultAccount = await AccountService.createAccount(defaultAccountData);
          
          // Show success message for the entire portfolio creation
          AlertService.success('Portfolio and account created successfully!');
          
          // Return portfolio with default account info
          return {
            ...portfolio,
            defaultAccount: defaultAccount
          };
        } catch (accountError) {
          console.error('Failed to create default account:', accountError);
          
          // Check if this is actually a success (backend bug workaround)
          const errorMessage = accountError.message || '';
          const isActuallySuccess = errorMessage.toLowerCase().includes('created successfully') || 
                                   errorMessage.toLowerCase().includes('account created');
          
          if (isActuallySuccess) {
            // Backend returned success as error - treat as success
            console.warn('Backend returned success message as error for account creation');
            AlertService.success('Portfolio and account created successfully!');
            return {
              ...portfolio,
              defaultAccount: {
                id: Date.now().toString(),
                name: defaultAccountName,
                type: 'cash_wallet',
                balance: 0,
                currency: currency,
                portfolioId: portfolio.id
              }
            };
          } else {
            // Actual error - Portfolio was created successfully, but default account failed
            AlertService.warning('Portfolio created, but failed to create default account. You can add accounts manually.');
            return portfolio;
          }
        }
      }
      
      return portfolio;
    } catch (error) {
      console.error('Create portfolio with default account error:', error);
      const errorMessage = error.message || 'Failed to create portfolio';
      AlertService.error(errorMessage);
      throw error;
    }
  }
}

export default PortfolioService;
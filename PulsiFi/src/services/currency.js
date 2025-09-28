import ApiService from './api';
import AlertService from '../utils/alert';

/**
 * Currency service for managing currency-related API calls
 */
class CurrencyService {
  /**
   * Get all currencies
   * @returns {Promise<Array>} Array of currencies
   */
  static async getAllCurrencies() {
    try {
      const response = await ApiService.get('/currencies', false);
      
      if (response.success) {
        return response.data.currencies || [];
      } else {
        return [];
      }
    } catch (error) {
      console.error('Get currencies error:', error);
      return [];
    }
  }

  /**
   * Get currency by code
   * @param {string} code - Currency code
   * @returns {Promise<Object>} Currency data
   */
  static async getCurrencyByCode(code) {
    try {
      const response = await ApiService.get(`/currencies/${code}`);
      
      if (response.success) {
        return response.data.currency;
      } else {
        throw new Error(response.message || 'Failed to fetch currency');
      }
    } catch (error) {
      console.error('Get currency error:', error);
      const errorMessage = error.message || 'Failed to fetch currency';
      AlertService.error(errorMessage);
      throw error;
    }
  }
}

export default CurrencyService;
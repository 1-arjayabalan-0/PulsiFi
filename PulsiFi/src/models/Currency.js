/**
 * Currency model
 * @typedef {Object} Currency
 * @property {string} id - Unique identifier
 * @property {string} code - Currency code (e.g., USD, EUR)
 * @property {string} name - Currency name (e.g., US Dollar)
 * @property {string} symbol - Currency symbol (e.g., $)
 */

/**
 * Creates a new Currency object
 * @param {Object} data - Raw currency data from API
 * @returns {Currency} Formatted currency object
 */
export const createCurrency = (data) => {
  return {
    id: data.id || '',
    code: data.code || '',
    name: data.name || '',
    symbol: data.symbol || ''
  };
};

export default {
  createCurrency
};
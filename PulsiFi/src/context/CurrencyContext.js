import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurrencyService from '../services/currency';

// Create context
const CurrencyContext = createContext();

// Context provider component
export const CurrencyProvider = ({ children }) => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCurrencyId, setActiveCurrencyId] = useState(null);
  const [activeCurrencySymbol, setActiveCurrencySymbol] = useState('');

  // Load currencies on mount
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setLoading(true);
        const currencyData = await CurrencyService.getAllCurrencies();
        setCurrencies(currencyData);
        setError(null);
      } catch (err) {
        console.error('Failed to load currencies:', err);
        setError('Failed to load currencies');
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, []);

  // Load user's active currency when currencies are loaded
  useEffect(() => {
    const loadUserCurrency = async () => {
      try {
        // Try to get user's portfolio data first to get the most up-to-date currency
        const PortfolioService = (await import('../services/portfolio')).default;
        const portfolios = await PortfolioService.getUserPortfolios();
        
        if (portfolios && portfolios.length > 0 && portfolios[0].currency) {
          // Use the currency from the first portfolio
          const portfolioCurrency = portfolios[0].currency;
          setActiveCurrencyId(portfolioCurrency.id);
          setActiveCurrencySymbol(portfolioCurrency.symbol);
          
          // Update AsyncStorage to match the database value
          await AsyncStorage.setItem('user_currency_id', portfolioCurrency.id);
        } else {
          // Fall back to AsyncStorage if API call fails or user has no portfolios
          const storedCurrencyId = await AsyncStorage.getItem('user_currency_id');
          
          if (storedCurrencyId) {
            setActiveCurrencyId(storedCurrencyId);
            
            // Find the currency symbol for this ID
            const currency = currencies.find(c => c.id === storedCurrencyId);
            if (currency) {
              setActiveCurrencySymbol(currency.symbol);
            }
          } else {
            // Default to USD if no currency is set
            const usdCurrency = currencies.find(c => c.code === 'USD');
            if (usdCurrency) {
              setActiveCurrencyId(usdCurrency.id);
              setActiveCurrencySymbol(usdCurrency.symbol);
              await AsyncStorage.setItem('user_currency_id', usdCurrency.id);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load user currency:', err);
      }
    };

    if (currencies.length > 0) {
      loadUserCurrency();
    }
  }, [currencies]);

  // Get currency by code
  const getCurrencyByCode = (code) => {
    return currencies.find(currency => currency.code === code) || null;
  };

  // Get currency by ID
  const getCurrencyById = (id) => {
    return currencies.find(currency => currency.id === id) || null;
  };

  // Get currency options for dropdowns
  const getCurrencyOptions = () => {
    return currencies.map(currency => ({
      label: `${currency.code} - ${currency.name}`,
      value: currency.id // Now using ID instead of code
    }));
  };

  // Set the active currency for the user
  const setUserCurrency = async (currencyId) => {
    try {
      setActiveCurrencyId(currencyId);
      
      // Find the currency symbol for this ID
      const currency = currencies.find(c => c.id === currencyId);
      if (currency) {
        setActiveCurrencySymbol(currency.symbol);
      }
      
      // Store in secure storage
      await AsyncStorage.setItem('user_currency_id', currencyId);
      return true;
    } catch (err) {
      console.error('Failed to set user currency:', err);
      return false;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencies,
        loading,
        error,
        activeCurrencyId,
        activeCurrencySymbol,
        getCurrencyByCode,
        getCurrencyById,
        getCurrencyOptions,
        setUserCurrency
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

// Custom hook to use the currency context
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
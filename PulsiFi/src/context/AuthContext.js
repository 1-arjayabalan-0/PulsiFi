import React, {createContext, useState, useContext, useEffect} from 'react';
import AuthService from '../services/auth';
import AlertService from '../utils/alert';
import { setAuthContext } from '../services/api';

// Create the authentication context
const AuthContext = createContext();

/**
 * AuthProvider component to manage authentication state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  // Create auth context methods object for ApiService
  const authContextMethods = {
    logout: async () => {
      setIsLoading(true);
      try {
        await AuthService.logout();
        setUser(null);
        setIsFirstTimeUser(false);
        AlertService.info('Your session has expired. Please log in again.');
      } catch (error) {
        console.error('Logout error:', error);
        // Even if logout fails, clear local state
        setUser(null);
        setIsFirstTimeUser(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Register auth context with ApiService
  useEffect(() => {
    setAuthContext(authContextMethods);
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await AuthService.isAuthenticated();
        if (isAuthenticated) {
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
          
          // Check if user has any portfolios (first-time user check)
          try {
            const PortfolioService = (await import('../services/portfolio')).default;
            const portfolios = await PortfolioService.getUserPortfolios();
            setIsFirstTimeUser(!portfolios || portfolios.length === 0);
          } catch (portfolioError) {
            console.error('Portfolio check error:', portfolioError);
            // If portfolio check fails, assume not first time to avoid showing create screen
            setIsFirstTimeUser(false);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await AuthService.login(email, password);
      if (result.success) {
        setUser(result.user);
        
        // Check if this is a first-time user (no portfolios)
        try {
          const PortfolioService = (await import('../services/portfolio')).default;
          const portfolios = await PortfolioService.getUserPortfolios();
          setIsFirstTimeUser(!portfolios || portfolios.length === 0);
        } catch (portfolioError) {
          console.error('Portfolio check error during login:', portfolioError);
          // If portfolio check fails, assume not first time to avoid showing create screen
          setIsFirstTimeUser(false);
        }
        
        AlertService.success('Welcome back! You have successfully logged in.');
        return true;
      } else {
        setAuthError(result.message);
        AlertService.error(result.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed';
      setAuthError(errorMessage);
      AlertService.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (email, password, name) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await AuthService.register(email, password, name);
      if (result.success) {
        setUser(result.user);
        // New users are always first-time users
        setIsFirstTimeUser(true);
        AlertService.success(
          'Account created successfully! Welcome to PulsiFi.',
        );
        return true;
      } else {
        setAuthError(result.message);
        AlertService.error(result.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.message || 'Registration failed';
      setAuthError(errorMessage);
      AlertService.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      setIsFirstTimeUser(false);
      AlertService.info('You have been logged out successfully.');
    } catch (error) {
      console.error('Logout error:', error);
      AlertService.error('An error occurred while logging out.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to mark first-time setup as completed
  const completeFirstTimeSetup = () => {
    setIsFirstTimeUser(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        authError,
        isAuthenticated: !!user,
        isFirstTimeUser,
        completeFirstTimeSetup,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

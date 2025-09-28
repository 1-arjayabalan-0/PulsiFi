import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Card, useTheme, Button, Input } from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountService from '../services/account';
import PortfolioService from '../services/portfolio';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateBankAccountScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const routePortfolioId = route.params?.portfolioId;
  
  const [portfolioId, setPortfolioId] = useState(routePortfolioId);
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Fetch default portfolio if none provided
  useEffect(() => {
    const fetchDefaultPortfolio = async () => {
      if (!portfolioId) {
        try {
          setLoading(true);
          const portfolios = await PortfolioService.getUserPortfolios();
          if (portfolios && portfolios.length > 0) {
            setPortfolioId(portfolios[0].id);
          } else {
            setErrors(prev => ({ ...prev, portfolio: 'No portfolio found. Please create a portfolio first.' }));
          }
        } catch (error) {
          console.error('Error fetching portfolios:', error);
          setErrors(prev => ({ ...prev, portfolio: 'Failed to fetch portfolios.' }));
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchDefaultPortfolio();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!portfolioId) {
      newErrors.portfolio = 'Portfolio is required. Please create a portfolio first.';
    }
    
    if (!bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }
    
    if (!accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }
    
    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d+$/.test(accountNumber)) {
      newErrors.accountNumber = 'Account number must contain only digits';
    }
    
    if (!routingNumber.trim()) {
      newErrors.routingNumber = 'Routing number is required';
    } else if (!/^\d{9}$/.test(routingNumber)) {
      newErrors.routingNumber = 'Routing number must be 9 digits';
    }
    
    if (!balance.trim()) {
      newErrors.balance = 'Initial balance is required';
    } else if (isNaN(parseFloat(balance))) {
      newErrors.balance = 'Balance must be a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveAccountCredentials = async (accountId) => {
    try {
      // Store information in AsyncStorage
      await AsyncStorage.setItem(
        `account_${accountId}`,
        JSON.stringify({
          bankName,
          accountNumber,
          routingNumber
        })
      );
      return true;
    } catch (error) {
      console.error('Error saving credentials:', error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Create account in the backend
      const response = await AccountService.createAccount({
        name: accountName,
        type: 'bank_account',
        balance: parseFloat(balance),
        portfolioId: portfolioId, // Ensure portfolioId is passed correctly
        bankName: bankName,
        accountNumber: accountNumber.slice(-4), // Only store last 4 digits in the database
        routingNumber: routingNumber.slice(-4)  // Only store last 4 digits in the database
      });
      
      // Store full account details securely
      if (response.account) {
        await saveAccountCredentials(response.account.id);
      }
      
      // Navigate back to the main screen
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error creating account:', error);
      setErrors({ submit: 'Failed to create account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Card style={styles.card}>
        <Text variant="h1" style={styles.title}>Add Bank Account</Text>
        
        {errors.portfolio && (
          <Text style={[styles.errorText, { color: theme.colors.error, marginBottom: 16 }]}>
            {errors.portfolio}
          </Text>
        )}
        
        <Input
          label="Bank Name"
          value={bankName}
          onChangeText={setBankName}
          placeholder="Enter bank name"
          error={errors.bankName}
          style={styles.input}
        />
        
        <Input
          label="Account Name"
          value={accountName}
          onChangeText={setAccountName}
          placeholder="Enter account name"
          error={errors.accountName}
          style={styles.input}
        />
        
        <Input
          label="Account Number"
          value={accountNumber}
          onChangeText={setAccountNumber}
          placeholder="Enter account number"
          keyboardType="numeric"
          error={errors.accountNumber}
          style={styles.input}
          secureTextEntry
        />
        
        <Input
          label="Routing Number"
          value={routingNumber}
          onChangeText={setRoutingNumber}
          placeholder="Enter 9-digit routing number"
          keyboardType="numeric"
          error={errors.routingNumber}
          style={styles.input}
          secureTextEntry
        />
        
        <Input
          label="Initial Balance"
          value={balance}
          onChangeText={setBalance}
          placeholder="Enter initial balance"
          keyboardType="numeric"
          error={errors.balance}
          style={styles.input}
        />
        
        {errors.submit && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {errors.submit}
          </Text>
        )}
        
        <Button 
          title={loading ? 'Creating Account...' : 'Add Bank Account'} 
          onPress={handleSubmit}
          disabled={loading}
          style={styles.button}
        />
        
        {loading && <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    padding: 20,
    marginBottom: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
  },
  loader: {
    marginTop: 16,
  }
});

export default CreateBankAccountScreen;
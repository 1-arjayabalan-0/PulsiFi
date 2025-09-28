import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Card, useTheme, Button, Input } from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createAccount } from '../services/account';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BankAccountDetailsScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { bank, portfolioId, parentId } = route.params;
  
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
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
          accountNumber,
          routingNumber,
          bankId: bank.id
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
      const response = await createAccount({
        name: accountName,
        type: 'bank_account',
        balance: parseFloat(balance),
        portfolioId,
        parentId,
        bankId: bank.id,
        accountNumber: accountNumber.slice(-4), // Only store last 4 digits in the database
        routingNumber: routingNumber.slice(-4)  // Only store last 4 digits in the database
      });
      
      // Store full account details securely
      if (response.account) {
        await saveAccountCredentials(response.account.id);
      }
      
      // Navigate back to the main screen
      navigation.navigate('Main');
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
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.bankInfoContainer}>
        <View style={[styles.bankLogoContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
          {bank.logo ? (
            <Image source={{ uri: bank.logo }} style={styles.bankLogo} resizeMode="contain" />
          ) : (
            <Icon name="bank" size={32} color={theme.colors.primary} />
          )}
        </View>
        <Text variant="h3" style={styles.bankName}>{bank.name}</Text>
      </View>
      
      <Card style={styles.formCard}>
        <Text variant="h3" style={styles.formTitle}>Account Details</Text>
        
        <Input
          label="Account Name"
          value={accountName}
          onChangeText={setAccountName}
          placeholder="e.g. My Checking Account"
          error={errors.accountName}
          containerStyle={styles.inputContainer}
        />
        
        <Input
          label="Account Number"
          value={accountNumber}
          onChangeText={setAccountNumber}
          placeholder="Enter your account number"
          keyboardType="number-pad"
          error={errors.accountNumber}
          containerStyle={styles.inputContainer}
          secureTextEntry
        />
        
        <Input
          label="Routing Number"
          value={routingNumber}
          onChangeText={setRoutingNumber}
          placeholder="9-digit routing number"
          keyboardType="number-pad"
          error={errors.routingNumber}
          containerStyle={styles.inputContainer}
          maxLength={9}
        />
        
        <Input
          label="Initial Balance"
          value={balance}
          onChangeText={setBalance}
          placeholder="0.00"
          keyboardType="decimal-pad"
          error={errors.balance}
          containerStyle={styles.inputContainer}
          prefix="$"
        />
        
        {errors.submit && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {errors.submit}
          </Text>
        )}
      </Card>
      
      <View style={styles.securityNotice}>
        <Icon name="shield-lock" size={20} color={theme.colors.textSecondary} />
        <Text variant="caption" style={[styles.securityText, { color: theme.colors.textSecondary }]}>
          Your account details are securely encrypted and stored only on your device
        </Text>
      </View>
      
      <Button
        title={loading ? 'Creating Account...' : 'Add Account'}
        onPress={handleSubmit}
        disabled={loading}
        style={styles.submitButton}
      />
      
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={theme.colors.primary} 
          style={styles.loader} 
        />
      )}
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
  bankInfoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bankLogoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  bankLogo: {
    width: 48,
    height: 48,
  },
  bankName: {
    textAlign: 'center',
  },
  formCard: {
    padding: 16,
    marginBottom: 24,
  },
  formTitle: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  securityText: {
    marginLeft: 8,
    flex: 1,
  },
  submitButton: {
    marginBottom: 24,
  },
  errorText: {
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  loader: {
    marginTop: 8,
  },
});

export default BankAccountDetailsScreen;
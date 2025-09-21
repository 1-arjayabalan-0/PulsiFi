import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Input, Select, useTheme } from '../components';
import { useAlert } from '../context/AlertContext';
import AccountService from '../services/account';
import CategoryService from '../services/category';
import TransactionService from '../services/transaction';

const AddTransactionScreen = ({ navigation }) => {
  const theme = useTheme();
  const { showAlert } = useAlert();
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('0.00');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [note, setNote] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load accounts from service
      const accountsData = await AccountService.getUserAccounts();
      setAccounts(accountsData);
      
      // Load categories from backend service
      const categoriesData = await CategoryService.getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading transaction form data:', error);
      setAccounts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Format categories for the Select component - filter by transaction type
  const categoryOptions = categories
    .filter(category => category.type === transactionType || category.type === 'both')
    .map(category => ({
      label: category.name,
      value: category.id,
      icon: category.icon
    }));

  // Format accounts for the Select component
  const accountOptions = accounts.map(account => ({
    label: account.name,
    value: account.id
  }));

  const handleSave = async () => {
    // Validate required fields
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }
    
    if (!selectedAccount) {
      showAlert({
        type: 'error',
        title: 'Missing Account',
        message: 'Please select an account for this transaction'
      });
      return;
    }

    try {
      // Prepare transaction data
      const transactionData = {
        type: transactionType,
        amount: parseFloat(amount),
        categoryId: selectedCategory.value, // Updated to use categoryId instead of category_id
        accountId: selectedAccount.value,   // Updated to use accountId instead of account_id
        description: note || '',
        date: new Date().toISOString()
      };

      // Create transaction using TransactionService
      const result = await TransactionService.createTransaction(transactionData);
      
      // Check if result exists (success case)
      if (result && (result.id || result.success !== false)) {
        // Show success alert
        showAlert({
          type: 'success',
          title: 'Transaction Created',
          message: `${transactionType === 'income' ? 'Income' : 'Expense'} of $${amount} has been added successfully`
        });
        // Navigate back on success
        navigation.goBack();
      } else {
        // Handle error case
        showAlert({
          type: 'error',
          title: 'Transaction Failed',
          message: 'Failed to create transaction. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      showAlert({
        type: 'error',
        title: 'Transaction Failed',
        message: 'An error occurred while creating the transaction. Please try again.'
      });
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading...</Text>
        </View>
      ) : (
        <>
          <View style={[styles.typeSelector, { backgroundColor: theme.colors.border }]}>
            <TouchableOpacity 
              style={[
                styles.typeButton, 
                transactionType === 'income' && {
                  backgroundColor: theme.colors.primary
                }
              ]}
              onPress={() => setTransactionType('income')}
            >
              <Text 
                style={[
                  styles.typeButtonText, 
                  { color: theme.colors.textSecondary },
                  transactionType === 'income' && { color: theme.colors.card }
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.typeButton, 
                transactionType === 'expense' && {
                  backgroundColor: theme.colors.primary
                }
              ]}
              onPress={() => setTransactionType('expense')}
            >
              <Text 
                style={[
                  styles.typeButtonText, 
                  { color: theme.colors.textSecondary },
                  transactionType === 'expense' && { color: theme.colors.card }
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Amount</Text>
            <View style={[styles.amountInputContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
              <Text style={[styles.currencySymbol, { color: theme.colors.text }]}>$</Text>
              <Input
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                style={{ marginBottom: 0 }}
                inputStyle={styles.amountInput}
              />
            </View>
          </View>

          <Select
            label="Category"
            options={categoryOptions}
            selectedOption={selectedCategory}
            onSelect={(option) => setSelectedCategory(option)}
            placeholder="Select a category"
          />

          <Input
            label="Note/Description"
            value={note}
            onChangeText={setNote}
            placeholder="Add a note"
            multiline
            inputStyle={{ minHeight: 80, textAlignVertical: 'top' }}
          />

          <Select
            label="Account"
            options={accountOptions}
            selectedOption={selectedAccount}
            onSelect={setSelectedAccount}
            placeholder="Select an account"
          />

          <Button
            title="Save"
            onPress={handleSave}
            variant="primary"
            size="large"
            style={{ marginTop: 20, marginBottom: 40 }}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    borderRadius: 30,
    marginBottom: 20,
    overflow: 'hidden',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 12,
  },
});

export default AddTransactionScreen;
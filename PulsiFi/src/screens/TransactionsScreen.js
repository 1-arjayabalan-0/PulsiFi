import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import services
import TransactionService from '../services/transaction';
import AccountService from '../services/account';
import { useCurrency } from '../context/CurrencyContext';

const TransactionsScreen = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'income', 'expense'
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { activeCurrencySymbol } = useCurrency();

  // Define categories inline (since we don't have a category service)
  const categories = [
    { id: 1, name: 'Food & Dining', icon: 'food', color: '#FF6B6B' },
    { id: 2, name: 'Transportation', icon: 'car', color: '#4ECDC4' },
    { id: 3, name: 'Shopping', icon: 'shopping', color: '#45B7D1' },
    { id: 4, name: 'Entertainment', icon: 'movie', color: '#96CEB4' },
    { id: 5, name: 'Bills & Utilities', icon: 'receipt', color: '#FFEAA7' },
    { id: 6, name: 'Healthcare', icon: 'medical-bag', color: '#DDA0DD' },
    { id: 7, name: 'Education', icon: 'school', color: '#98D8C8' },
    { id: 8, name: 'Salary', icon: 'cash', color: '#4CD964' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, accountsData] = await Promise.all([
        TransactionService.getAllTransactions(),
        AccountService.getAllAccounts()
      ]);
      
      setTransactions(transactionsData || []);
      setAccounts(accountsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      // Set empty arrays as fallback
      setTransactions([]);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const getAccountById = (id) => {
    return accounts.find(account => account.id === id) || { name: 'Unknown' };
  };

  const getCategoryDetails = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category || { icon: 'help-circle', color: '#8E8E93' };
  };

  const renderTransactionItem = ({ item }) => {
    const account = getAccountById(item.account_id);
    const categoryDetails = getCategoryDetails(item.category);
    
    return (
      <View style={styles.transactionItem}>
        <View style={[styles.iconContainer, { backgroundColor: `${categoryDetails.color}20` }]}>
          <Icon name={categoryDetails.icon} size={24} color={categoryDetails.color} />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.accountName}>{account.name}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amount, { color: item.type === 'income' ? '#4CD964' : '#FF3B30' }]}>
            {item.type === 'income' ? '+' : '-'}{activeCurrencySymbol}{item.amount.toFixed(2)}
          </Text>
          <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : (
        <>
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, filter === 'income' && styles.activeFilter]}
              onPress={() => setFilter('income')}
            >
              <Text style={[styles.filterText, filter === 'income' && styles.activeFilterText]}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, filter === 'expense' && styles.activeFilter]}
              onPress={() => setFilter('expense')}
            >
              <Text style={[styles.filterText, filter === 'expense' && styles.activeFilterText]}>Expense</Text>
            </TouchableOpacity>
          </View>

          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredTransactions}
              keyExtractor={item => item.id}
              renderItem={renderTransactionItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#007AFF']}
                  tintColor="#007AFF"
                />
              }
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
  activeFilter: {
    backgroundColor: '#1DD1A1',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingVertical: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  accountName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default TransactionsScreen;
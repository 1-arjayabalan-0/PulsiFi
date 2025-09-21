import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text, Card, Button, useTheme } from '../components';
import AccountService from '../services/account';
import TransactionService from '../services/transaction';

const HomeScreen = ({ navigation }) => {
  const theme = useTheme();
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      
      // Load accounts
      const accountsData = await AccountService.getUserAccounts();
      setAccounts(accountsData);
      
      // Calculate total balance from all accounts
      const total = accountsData.reduce((sum, account) => sum + account.balance, 0);
      setTotalBalance(total);

      // Load recent transactions
      const transactionsData = await TransactionService.getUserTransactions();
      const recent = [...transactionsData]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
      setRecentTransactions(recent);
    } catch (error) {
      console.error('Error loading home screen data:', error);
      // Set empty arrays as fallback
      setAccounts([]);
      setRecentTransactions([]);
      setTotalBalance(0);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#007AFF']}
          tintColor="#007AFF"
        />
      }
    >
      <View style={styles.header}>
        <Text variant="h1" style={styles.welcomeText}>Welcome back!</Text>
        <Text variant="body2" style={styles.dateText}>{new Date().toDateString()}</Text>
      </View>

      <Card style={[styles.balanceCard, { backgroundColor: theme.colors.primary }]}>
        <Text variant="body1" style={styles.balanceLabel}>Total Balance</Text>
        <Text variant="h1" style={styles.balanceAmount}>
          {loading ? 'Loading...' : `$${totalBalance.toFixed(2)}`}
        </Text>
        <Button 
          variant="secondary"
          style={styles.addAccountButton}
          onPress={() => navigation.navigate('AddSubAccount')}
        >
          + Add Account
        </Button>
      </Card>

      <View style={styles.accountsSection}>
        <View style={styles.sectionHeader}>
          <Text variant="h2" style={styles.sectionTitle}>Your Accounts</Text>
          <TouchableOpacity>
            <Text variant="button" style={{ color: theme.colors.primary }}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Card style={styles.accountCard}>
            <Text variant="body2">Loading accounts...</Text>
          </Card>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {accounts.length === 0 ? (
              <Card style={styles.accountCard}>
                <Text variant="body2">No accounts found</Text>
              </Card>
            ) : (
              accounts.map(account => (
                <Card key={account.id} style={styles.accountCard}>
                  <View style={[styles.accountIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                    <Icon 
                      name={account.type === 'bank_account' ? 'bank' : 
                            account.type === 'credit_debit' ? 'credit-card' : 
                            account.type === 'cash_wallet' ? 'cash' : 'wallet'} 
                      size={24} 
                      color={theme.colors.primary} 
                    />
                  </View>
                  <Text variant="subtitle" style={styles.accountName}>{account.name}</Text>
                  <Text variant="h3" style={styles.accountBalance}>
                    ${account.balance.toFixed(2)}
                  </Text>
                </Card>
              ))
            )}
          </ScrollView>
        )}
      </View>

      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeader}>
          <Text variant="h2" style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text variant="button" style={{ color: theme.colors.primary }}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Card style={styles.transactionItem}>
            <Text variant="body2">Loading transactions...</Text>
          </Card>
        ) : recentTransactions.length === 0 ? (
          <Card style={styles.transactionItem}>
            <Text variant="body2">No recent transactions</Text>
          </Card>
        ) : (
          recentTransactions.map(transaction => {
            const account = accounts.find(acc => acc.id === transaction.account_id);
            const isIncome = transaction.type === 'income';
            const transactionColor = isIncome ? theme.colors.success : theme.colors.error;
            
            return (
              <Card key={transaction.id} style={styles.transactionItem}>
                <View style={[styles.transactionIconContainer, { backgroundColor: `${transactionColor}20` }]}>
                  <Icon 
                    name={transaction.category === 'Food & Dining' ? 'food' : 
                          transaction.category === 'Transportation' ? 'car' : 
                          transaction.category === 'Entertainment' ? 'film' : 
                          transaction.category === 'Utilities' ? 'lightbulb' : 
                          transaction.category === 'Salary' ? 'briefcase' : 'cash'} 
                    size={24} 
                    color={transactionColor} 
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text variant="subtitle" style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text variant="caption" style={styles.transactionAccount}>{account ? account.name : 'Unknown Account'}</Text>
                </View>
                <Text 
                  variant="h3"
                  style={[styles.transactionAmount, {color: transactionColor}]}
                >
                  {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                </Text>
              </Card>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  welcomeText: {
    marginBottom: 5,
  },
  dateText: {
    marginTop: 5,
  },
  balanceCard: {
    padding: 20,
    margin: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  balanceLabel: {
    marginBottom: 8,
    opacity: 0.8,
  },
  balanceAmount: {
    marginBottom: 20,
  },
  addAccountButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  accountsSection: {
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  accountCard: {
    padding: 15,
    marginLeft: 20,
    marginRight: 5,
    marginVertical: 10,
    width: 150,
  },
  accountIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  accountName: {
    marginBottom: 5,
  },
  transactionsSection: {
    marginVertical: 10,
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    marginBottom: 2,
  },
  transactionAccount: {
    marginTop: 2,
  },
});

export default HomeScreen;
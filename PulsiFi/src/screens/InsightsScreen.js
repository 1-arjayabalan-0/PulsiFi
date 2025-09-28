import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import services
import TransactionService from '../services/transaction';
import { useCurrency } from '../context/CurrencyContext';

const InsightsScreen = () => {
  const [transactions, setTransactions] = useState([]);
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
      const transactionsData = await TransactionService.getAllTransactions();
      setTransactions(transactionsData || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Calculate total income and expenses
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.category;
      if (!acc[category]) acc[category] = 0;
      acc[category] += t.amount;
      return acc;
    }, {});

  // Sort categories by expense amount
  const sortedCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => {
      const categoryInfo = categories.find(c => c.name === name) || { icon: 'help-circle', color: '#8E8E93' };
      return { name, amount, icon: categoryInfo.icon, color: categoryInfo.color };
    });

  return (
    <ScrollView 
      style={styles.container}
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
        <Text style={styles.title}>Insights</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading insights...</Text>
        </View>
      ) : transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No transaction data available</Text>
        </View>
      ) : (
        <>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryAmount, { color: '#4CD964' }]}>
                {activeCurrencySymbol}{totalIncome.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Expenses</Text>
              <Text style={[styles.summaryAmount, { color: '#FF3B30' }]}>
                {activeCurrencySymbol}{totalExpenses.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Spending by Category</Text>
            
            {sortedCategories.length === 0 ? (
              <Text style={styles.noCategoriesText}>No expense categories found</Text>
            ) : (
              sortedCategories.map((category, index) => (
                <View key={index} style={styles.categoryItem}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                    <Icon name={category.icon} size={24} color={category.color} />
                  </View>
                  <View style={styles.categoryDetails}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <View style={styles.progressBarContainer}>
                      <View 
                        style={[styles.progressBar, { 
                          width: `${totalExpenses > 0 ? (category.amount / totalExpenses) * 100 : 0}%`,
                          backgroundColor: category.color 
                        }]}
                      />
                    </View>
                  </View>
                  <Text style={styles.categoryAmount}>{activeCurrencySymbol}{category.amount.toFixed(2)}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Monthly Overview</Text>
            <View style={styles.monthlyOverviewCard}>
              <Text style={styles.monthlyOverviewText}>Net Savings</Text>
              <Text style={[styles.monthlyOverviewAmount, { color: totalIncome - totalExpenses >= 0 ? '#4CD964' : '#FF3B30' }]}>
                {activeCurrencySymbol}{(totalIncome - totalExpenses).toFixed(2)}
              </Text>
              <View style={styles.savingsRateContainer}>
                <Text style={styles.savingsRateLabel}>Savings Rate</Text>
                <Text style={styles.savingsRateValue}>
                  {totalIncome > 0 ? `${(((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)}%` : '0%'}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </ScrollView>
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  noCategoriesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryDetails: {
    flex: 1,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  monthlyOverviewCard: {
    alignItems: 'center',
  },
  monthlyOverviewText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  monthlyOverviewAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  savingsRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  savingsRateLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  savingsRateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default InsightsScreen;
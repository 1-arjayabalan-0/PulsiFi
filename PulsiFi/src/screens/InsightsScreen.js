import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TransactionService from '../services/transaction';
import { useCurrency } from '../context/CurrencyContext';

import AnimatedProgressBar from '../components/AnimatedProgressBar';
import AnimatedBarChart from '../components/AnimatedBarChart';
import Card from '../components/Card';
import { useTheme } from '../components/ThemeProvider';

const InsightsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { activeCurrencySymbol } = useCurrency();
  const theme = useTheme();
  console.log("theme", theme);
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    title: {
      fontSize: theme.typography.fontSizes.xl,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
    },
    loadingText: {
      fontSize: theme.typography.fontSizes.md,
      color: theme.colors.text.secondary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
    },
    emptyText: {
      fontSize: theme.typography.fontSizes.md,
      color: theme.colors.text.secondary,
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    summaryCardContent: {
      padding: 16,
      alignItems: 'center',
    },
    summaryLabel: {
      fontSize: theme.typography.fontSizes.sm,
      marginBottom: 8,
    },
    summaryAmount: {
      fontSize: theme.typography.fontSizes.lg,
      fontWeight: 'bold',
    },
    sectionContainer: {
      marginHorizontal: 16,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSizes.lg,
      fontWeight: '600',
      marginBottom: 16,
    },
    noCategoriesText: {
      fontSize: theme.typography.fontSizes.md,
      textAlign: 'center',
      marginVertical: 16,
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    categoryIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    categoryDetails: {
      flex: 1,
    },
    categoryNameRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    categoryName: {
      fontSize: theme.typography.fontSizes.md,
      fontWeight: '500',
    },
    categoryAmount: {
      fontSize: theme.typography.fontSizes.sm,
      fontWeight: '500',
    },
    monthlyOverviewContent: {
      padding: 16,
      alignItems: 'center',
    },
    monthlyOverviewText: {
      fontSize: theme.typography.fontSizes.md,
      marginBottom: 8,
    },
    monthlyOverviewAmount: {
      fontSize: theme.typography.fontSizes.xl,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    savingsRateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    savingsRateLabel: {
      fontSize: theme.typography.fontSizes.sm,
      marginRight: 8,
    },
    savingsRateValue: {
      fontSize: theme.typography.fontSizes.md,
      fontWeight: '600',
    },
  });

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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

  // Monthly data for bar chart
  const monthlyData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 40 },
    { label: 'Mar', value: 85 },
    { label: 'Apr', value: 55 },
    { label: 'May', value: 72 }
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

      // Trigger animations when data loads
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        })
      ]).start();

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
          <Animated.View
            style={[
              styles.summaryContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Card variant="glass" animated={true}>
              <View style={styles.summaryCardContent}>
                <Text style={[styles.summaryLabel, { color: theme.colors.text.secondary }]}>Income</Text>
                <Text style={[styles.summaryAmount, { color: theme.colors.trendIncrease }]}>
                  {activeCurrencySymbol}{totalIncome.toFixed(2)}
                </Text>
              </View>
            </Card>
            <Card variant="glass" animated={true}>
              <View style={styles.summaryCardContent}>
                <Text style={[styles.summaryLabel, { color: theme.colors.text.secondary }]}>Expenses</Text>
                <Text style={[styles.summaryAmount, { color: theme.colors.trendDecrease }]}>
                  {activeCurrencySymbol}{totalExpenses.toFixed(2)}
                </Text>
              </View>
            </Card>
          </Animated.View>

          <Animated.View
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Card>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Spending by Category</Text>

              {sortedCategories.length === 0 ? (
                <Text style={[styles.noCategoriesText, { color: theme.colors.text.secondary }]}>No expense categories found</Text>
              ) : (
                sortedCategories.map((category, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                      <Icon name={category.icon} size={24} color={category.color} />
                    </View>
                    <View style={styles.categoryDetails}>
                      <View style={styles.categoryNameRow}>
                        <Text style={[styles.categoryName, { color: theme.colors.text.primary }]}>{category.name}</Text>
                        <Text style={[styles.categoryAmount, { color: theme.colors.text.secondary }]}>
                          {activeCurrencySymbol}{category.amount.toFixed(2)}
                        </Text>
                      </View>
                      <AnimatedProgressBar
                        value={category.amount}
                        maxValue={totalExpenses}
                        color={category.color}
                      />
                    </View>
                  </View>
                ))
              )}
            </Card>
          </Animated.View>

          <Animated.View
            style={[
              styles.sectionContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Card variant="gradient" gradientColors={['#f0f9ff', '#e0f2fe']}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Monthly Overview</Text>

              <AnimatedBarChart data={monthlyData} />

              <View style={styles.monthlyOverviewContent}>
                <Text style={[styles.monthlyOverviewText, { color: theme.colors.text.secondary }]}>Net Savings</Text>
                <Text style={[
                  styles.monthlyOverviewAmount,
                  { color: totalIncome - totalExpenses >= 0 ? theme.colors.charts.trendIncreaseColor : theme.colors.trendDecrease }
                ]}>
                  {activeCurrencySymbol}{(totalIncome - totalExpenses).toFixed(2)}
                </Text>
                <View style={styles.savingsRateContainer}>
                  <Text style={[styles.savingsRateLabel, { color: theme.colors.text.secondary }]}>Savings Rate</Text>
                  <Text style={[styles.savingsRateValue, { color: theme.colors.text.primary }]}>
                    {totalIncome > 0 ? `${(((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)}%` : '0%'}
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>
        </>
      )}
    </ScrollView>
  );
};



export default InsightsScreen;
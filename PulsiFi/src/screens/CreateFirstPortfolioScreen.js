import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text, Input, Button, Select, Card, useTheme} from '../components';
import {useAuth} from '../context/AuthContext';
import PortfolioService from '../services/portfolio';
import AlertService from '../utils/alert';

const CreateFirstPortfolioScreen = ({navigation}) => {
  const theme = useTheme();
  const {completeFirstTimeSetup} = useAuth();
  const [accountName, setAccountName] = useState('My Portfolio');
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(false);

  const currencyOptions = [
    {label: 'USD - United States Dollar', value: 'USD'},
    {label: 'EUR - Euro', value: 'EUR'},
    {label: 'GBP - British Pound', value: 'GBP'},
    {label: 'JPY - Japanese Yen', value: 'JPY'},
    {label: 'CAD - Canadian Dollar', value: 'CAD'},
    {label: 'AUD - Australian Dollar', value: 'AUD'},
    {label: 'CHF - Swiss Franc', value: 'CHF'},
    {label: 'CNY - Chinese Yuan', value: 'CNY'},
  ];

  const handleCreatePortfolio = async () => {
    if (!accountName.trim()) {
      AlertService.error('Please enter a portfolio name');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create portfolio with default account
      const portfolioData = {
        name: accountName.trim(),
        currency: currency,
        createDefaultAccount: true
      };

      const createdPortfolio = await PortfolioService.createPortfolioWithDefaultAccount(portfolioData);
      
      if (createdPortfolio) {
        // Success message is already shown by the service
        // AlertService.success('Portfolio created successfully!');
        
        // Complete first time setup
        completeFirstTimeSetup();
      }
    } catch (error) {
      console.error('Portfolio creation error:', error);
      // Error is already handled by the service
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Welcome Header */}
      <View style={styles.headerSection}>
        <Icon name="wallet" size={64} color={theme.colors.primary} />
        <Text variant="h1" style={styles.welcomeTitle}>
          Welcome to PulsiFi!
        </Text>
        <Text variant="body" style={styles.welcomeSubtitle}>
          Let's create your first portfolio to start managing your finances
        </Text>
      </View>

      {/* Portfolio Setup Form */}
      <View style={styles.formSection}>
        <Text variant="h2" style={styles.sectionTitle}>
          Portfolio Setup
        </Text>

        <View style={styles.inputGroup}>
          <Text variant="label">Portfolio Name</Text>
          <Input
            value={accountName}
            onChangeText={setAccountName}
            placeholder="Enter portfolio name"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text variant="label">Base Currency</Text>
          <Select
            value={currency}
            onValueChange={setCurrency}
            options={currencyOptions}
            placeholder="Select currency"
            style={styles.input}
          />
        </View>
      </View>

      {/* Default Account Section */}
      <View style={styles.accountSection}>
        <Text variant="h2" style={styles.sectionTitle}>
          Default Account
        </Text>
        <Text variant="body" style={styles.accountDescription}>
          Your portfolio will start with a Cash Account to track your income and
          expenses.
        </Text>

        <Card style={[styles.accountCard, {borderColor: theme.colors.primary}]}>
          <View style={styles.accountCardContent}>
            <View style={styles.accountIcon}>
              <Icon name="cash" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.accountInfo}>
              <Text variant="h3" style={styles.accountName}>
                Cash Account
              </Text>
              <Text variant="body" style={styles.accountType}>
                Default • {currency}
              </Text>
              <Text variant="caption" style={styles.accountDescription}>
                Track your cash transactions, income, and daily expenses
              </Text>
            </View>
            <View style={styles.selectedIndicator}>
              <Icon
                name="check-circle"
                size={24}
                color={theme.colors.primary}
              />
            </View>
          </View>
        </Card>
      </View>

      {/* Current Portfolio Info */}
      <View style={styles.infoSection}>
        <View
          style={[
            styles.infoCard,
            {backgroundColor: theme.colors.primaryLight},
          ]}>
          <Icon name="information" size={20} color={theme.colors.primary} />
          <Text
            variant="caption"
            style={[styles.infoText, {color: theme.colors.primary}]}>
            This will be your current portfolio to manage your account incomes
            and expenses
          </Text>
        </View>
      </View>

      {/* Create Button */}
      <Button
        style={styles.createButton}
        onPress={handleCreatePortfolio}
        variant="primary"
        loading={isLoading}
        disabled={isLoading}>
        Create My Portfolio
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  welcomeTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 20,
  },
  formSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    marginTop: 8,
  },
  accountSection: {
    marginBottom: 24,
  },
  accountDescription: {
    opacity: 0.7,
    marginBottom: 16,
  },
  accountCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
  accountCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(29, 209, 161, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    marginBottom: 4,
  },
  accountType: {
    opacity: 0.7,
    marginBottom: 4,
  },
  selectedIndicator: {
    marginLeft: 12,
  },
  infoSection: {
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    marginLeft: 8,
    flex: 1,
  },
  createButton: {
    marginBottom: 40,
  },
});

export default CreateFirstPortfolioScreen;

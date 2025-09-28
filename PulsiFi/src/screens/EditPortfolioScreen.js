import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Input, Button, Select, useTheme } from '../components';
import { useCurrency } from '../context/CurrencyContext';
import PortfolioService from '../services/portfolio';

const EditPortfolioScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { portfolio } = route.params || {};
  const [accountName, setAccountName] = useState('');
  const [currencyId, setCurrencyId] = useState('');
  const { currencies, getCurrencyOptions, setUserCurrency } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    // Set initial values from portfolio data
    if (portfolio) {
      setAccountName(portfolio.name || '');
      setCurrencyId(portfolio.currencyId || '');
    }
  }, [portfolio]);

  useEffect(() => {
    // Get currency options and set them
    if (currencies.length > 0) {
      const options = getCurrencyOptions();
      setCurrencyOptions(options);
      
      // Set selected currency if we have a currencyId
      if (currencyId) {
        const option = options.find(opt => opt.value === currencyId);
        if (option) {
          setSelectedOption(option);
        }
      }
    }
  }, [currencies, currencyId]);

  const handleCurrencyChange = (option) => {
    setCurrencyId(option.value);
    setSelectedOption(option);
  };

  const handleUpdatePortfolio = async () => {
    if (!accountName.trim() || !currencyId) {
      return;
    }

    setIsLoading(true);
    try {
      // Update portfolio with currency ID
      const portfolioData = {
        name: accountName,
        currencyId: currencyId
      };
      
      await PortfolioService.updatePortfolio(portfolio.id, portfolioData);
      
      // Set this as the user's active currency
      await setUserCurrency(currencyId);
      
      // Navigate back on success
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.formSection}>
        <Text variant="label">Account Name</Text>
        <Input
          value={accountName}
          onChangeText={setAccountName}
          placeholder="Enter account name"
        />
      </View>

      <View style={styles.formSection}>
        <Text variant="label">Currency</Text>
        <Select
          options={currencyOptions}
          selectedOption={selectedOption}
          onSelect={handleCurrencyChange}
          placeholder="Select currency"
        />
      </View>

      <Button 
        style={styles.updateButton} 
        onPress={handleUpdatePortfolio}
        variant="primary"
        loading={isLoading}
      >
        Update Portfolio
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  updateButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default EditPortfolioScreen;
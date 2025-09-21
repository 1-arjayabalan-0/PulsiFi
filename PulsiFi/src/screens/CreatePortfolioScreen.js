import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text, Input, Button, Select, useTheme } from '../components';

const CreatePortfolioScreen = ({ navigation }) => {
  const theme = useTheme();
  const [accountName, setAccountName] = useState('My Finances');
  const [currency, setCurrency] = useState('USD - United States Dollar');

  const currencyOptions = [
    { label: 'USD - United States Dollar', value: 'USD' },
    { label: 'EUR - Euro', value: 'EUR' },
    { label: 'GBP - British Pound', value: 'GBP' },
    { label: 'JPY - Japanese Yen', value: 'JPY' },
    { label: 'CAD - Canadian Dollar', value: 'CAD' },
  ];

  const handleCreatePortfolio = () => {
    // In a real app, we would save the portfolio to the database
    // For now, we'll just navigate back
    navigation.goBack();
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
          value={currency}
          onValueChange={setCurrency}
          options={currencyOptions}
          placeholder="Select currency"
        />
      </View>

      <Button 
        style={styles.createButton} 
        onPress={handleCreatePortfolio}
        variant="primary"
      >
        Create Portfolio
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
  createButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default CreatePortfolioScreen;
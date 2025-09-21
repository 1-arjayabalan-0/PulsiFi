import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, useTheme } from '../components';

const AddSubAccountScreen = ({ navigation }) => {
  const theme = useTheme();
  const [accountTypes, setAccountTypes] = useState([]);
  
  useEffect(() => {
    // Define account types directly in the component instead of using static JSON
    const types = [
      {
        id: "cash_wallet",
        name: "Cash / Wallet",
        description: "Track your physical cash",
        icon: "cash"
      },
      {
        id: "bank_account",
        name: "Bank Account",
        description: "Connect via Plaid or SMS",
        icon: "bank"
      },
      {
        id: "credit_debit",
        name: "Credit / Debit Card",
        description: "Manage card transactions",
        icon: "credit-card"
      },
      {
        id: "upi_digital",
        name: "UPI / Digital Wallet",
        description: "Track digital wallet balance",
        icon: "qrcode"
      }
    ];
    setAccountTypes(types);
  }, []);
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Select Account Type</Text>

      {accountTypes.map((type) => (
        <Card 
          key={type.id}
          style={styles.accountTypeCard}
          variant="default"
        >
          <TouchableOpacity 
            style={styles.accountTypeContent}
            onPress={() => navigation.goBack()}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Icon 
                name={type.icon} 
                size={24} 
                color={theme.colors.primary} 
              />
            </View>
            <View style={styles.accountTypeInfo}>
              <Text style={[styles.accountTypeName, { color: theme.colors.text }]}>{type.name}</Text>
              <Text style={[styles.accountTypeDescription, { color: theme.colors.textSecondary }]}>{type.description}</Text>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.border} />
          </TouchableOpacity>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  accountTypeCard: {
    marginBottom: 12,
    padding: 0,
  },
  accountTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountTypeInfo: {
    flex: 1,
  },
  accountTypeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountTypeDescription: {
    fontSize: 14,
  },
});

export default AddSubAccountScreen;
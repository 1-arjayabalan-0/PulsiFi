import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Card, useTheme, Button } from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getBanks } from '../services/account';

const BankSelectionScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const response = await getBanks();
      setBanks(response.banks);
      setError(null);
    } catch (err) {
      console.error('Error fetching banks:', err);
      setError('Failed to load banks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank.id === selectedBank?.id ? null : bank);
  };

  const handleContinue = () => {
    if (selectedBank) {
      navigation.navigate('BankAccountDetails', { 
        bank: selectedBank,
        ...route.params
      });
    }
  };

  const renderBankItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleBankSelect(item)}>
      <Card 
        style={[
          styles.bankCard, 
          selectedBank?.id === item.id && { 
            borderColor: theme.colors.primary,
            borderWidth: 2
          }
        ]}
      >
        <View style={styles.bankContent}>
          {item.logo ? (
            <Image 
              source={{ uri: item.logo }} 
              style={styles.bankLogo} 
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.bankLogoPlaceholder, { backgroundColor: `${theme.colors.primary}20` }]}>
              <Icon name="bank" size={24} color={theme.colors.primary} />
            </View>
          )}
          <View style={styles.bankInfo}>
            <Text variant="subtitle">{item.name}</Text>
            <Text variant="caption" style={{ color: theme.colors.textSecondary }}>
              {item.website || 'No website available'}
            </Text>
          </View>
          {selectedBank?.id === item.id && (
            <Icon name="check-circle" size={24} color={theme.colors.primary} />
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16 }}>Loading banks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <Icon name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={{ marginTop: 16, color: theme.colors.error }}>{error}</Text>
        <Button 
          title="Retry" 
          onPress={fetchBanks} 
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="h2" style={styles.title}>Select Your Bank</Text>
      <Text variant="body" style={styles.subtitle}>
        Choose your bank to securely connect your account
      </Text>
      
      <FlatList
        data={banks}
        renderItem={renderBankItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="bank-off" size={48} color={theme.colors.textSecondary} />
            <Text style={{ marginTop: 16, textAlign: 'center' }}>
              No banks available. Please try again later.
            </Text>
          </View>
        }
      />
      
      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedBank}
          style={{ opacity: !selectedBank ? 0.7 : 1 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
    opacity: 0.7,
  },
  listContainer: {
    paddingBottom: 16,
  },
  bankCard: {
    marginBottom: 12,
    padding: 16,
  },
  bankContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  bankLogoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankInfo: {
    flex: 1,
    marginLeft: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  footer: {
    paddingVertical: 16,
  },
});

export default BankSelectionScreen;
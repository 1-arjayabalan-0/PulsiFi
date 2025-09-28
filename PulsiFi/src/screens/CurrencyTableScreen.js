import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../components/ThemeProvider';

/**
 * Screen to display all available currencies in a table format
 */
const CurrencyTableScreen = () => {
  const { currencies, loading, error } = useCurrency();
  const { colors } = useTheme();

  // Render each currency item
  const renderCurrencyItem = ({ item }) => (
    <View style={[styles.currencyItem, { borderBottomColor: colors.border }]}>
      <View style={styles.codeContainer}>
        <Text style={[styles.currencyCode, { color: colors.primary }]}>{item.code}</Text>
        <Text style={[styles.currencySymbol, { color: colors.text }]}>{item.symbol}</Text>
      </View>
      <Text style={[styles.currencyName, { color: colors.text }]}>{item.name}</Text>
    </View>
  );

  // Render header for the list
  const renderHeader = () => (
    <View style={[styles.headerRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <Text style={[styles.headerText, { color: colors.text }]}>Code / Symbol</Text>
      <Text style={[styles.headerText, { color: colors.text }]}>Currency Name</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
     {/* <Header title="Currencies" showBackButton /> */}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading currencies...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={currencies}
          renderItem={renderCurrencyItem}
          keyExtractor={(item) => item.id || item.code}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.text }]}>No currencies available</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  currencyItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  codeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  currencySymbol: {
    fontSize: 16,
  },
  currencyName: {
    flex: 1,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
  },
});

export default CurrencyTableScreen;
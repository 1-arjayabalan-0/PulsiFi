import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AddScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => navigation.navigate('AddTransaction')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#1DD1A120' }]}>
            <Icon name="receipt" size={32} color="#1DD1A1" />
          </View>
          <Text style={styles.optionTitle}>Add Transaction</Text>
          <Text style={styles.optionDescription}>Record income or expense</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => navigation.navigate('CreateBankAccount')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#007AFF20' }]}>
            <Icon name="wallet" size={32} color="#007AFF" />
          </View>
          <Text style={styles.optionTitle}>Add Bank Account</Text>
          <Text style={styles.optionDescription}>Add a new bank account</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => navigation.navigate('CreatePortfolio')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#5856D620' }]}>
            <Icon name="briefcase" size={32} color="#5856D6" />
          </View>
          <Text style={styles.optionTitle}>Create Portfolio</Text>
          <Text style={styles.optionDescription}>Organize your finances</Text>
        </TouchableOpacity>
      </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsContainer: {
    padding: 20,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default AddScreen;
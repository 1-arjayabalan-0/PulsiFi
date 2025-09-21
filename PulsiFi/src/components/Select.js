import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from './ThemeProvider';

/**
 * Select component with consistent styling
 * @param {Object} props - Component props
 * @param {string} props.label - Select label
 * @param {Array} props.options - Array of options
 * @param {Object} props.selectedOption - Selected option
 * @param {Function} props.onSelect - Function to call when an option is selected
 * @param {string} props.placeholder - Select placeholder
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Whether the select is disabled
 * @param {Object} props.style - Additional style for the select container
 */
const Select = ({
  label,
  options = [],
  selectedOption,
  onSelect = () => {},
  placeholder = 'Select an option',
  error,
  disabled = false,
  style,
}) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  
  const handleSelect = (option) => {
    console.log('handleSelect', option);
    onSelect(option);
    setModalVisible(false);
  };
  
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.selectButton,
          {
            borderColor: error ? theme.colors.error : theme.colors.border,
            backgroundColor: disabled ? theme.colors.border : 'transparent',
          },
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text 
          style={[
            styles.selectText,
            { color: selectedOption ? theme.colors.text : theme.colors.textSecondary },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Icon name="chevron-down" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
      
      {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
      
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View 
            style={[
              styles.modalContent,
              { 
                backgroundColor: theme.colors.card,
                ...theme.shadows.large,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{label || 'Select an option'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.optionItem,
                    selectedOption && selectedOption.value === item.value && {
                      backgroundColor: theme.colors.primaryLight,
                    },
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.optionText, { color: theme.colors.text }]}>{item.label}</Text>
                  {selectedOption && selectedOption.value === item.value && (
                    <Icon name="check" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  selectButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionText: {
    fontSize: 16,
  },
});

export default Select;
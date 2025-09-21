import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { useTheme } from './ThemeProvider';

/**
 * Input component with consistent styling
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.value - Input value
 * @param {Function} props.onChangeText - Function to call when text changes
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {Object} props.style - Additional style for the input container
 * @param {Object} props.inputStyle - Additional style for the input field
 */
const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  style,
  inputStyle,
  ...props
}) => {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? theme.colors.error : theme.colors.primary,
            color: theme.colors.text,
            backgroundColor: disabled ? theme.colors.border : 'transparent',
          },
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        editable={!disabled}
        {...props}
      />
      {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
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
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
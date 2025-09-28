import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AlertService from '../utils/alert';
import { colors } from '../utils/colors';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const { register, isLoading, authError } = useAuth();

  // Reset errors when inputs change
  useEffect(() => {
    setNameError('');
  }, [name]);

  useEffect(() => {
    setEmailError('');
  }, [email]);

  useEffect(() => {
    setPasswordError('');
    
    // Password strength validation
    if (password) {
      const hasMinLength = password.length >= 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      let strength = 0;
      let feedback = '';
      
      if (hasMinLength) strength += 1;
      if (hasUpperCase) strength += 1;
      if (hasNumber) strength += 1;
      if (hasSpecialChar) strength += 1;
      
      setPasswordStrength(strength);
      
      if (strength === 0) {
        feedback = 'Very weak password';
      } else if (strength === 1) {
        feedback = 'Weak password';
      } else if (strength === 2) {
        feedback = 'Fair password';
      } else if (strength === 3) {
        feedback = 'Good password';
      } else {
        feedback = 'Strong password';
      }
      
      setPasswordFeedback(feedback);
    } else {
      setPasswordStrength(0);
      setPasswordFeedback('');
    }
  }, [password]);

  useEffect(() => {
    setConfirmPasswordError('');
  }, [confirmPassword]);

  // Validate form
  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      isValid = false;
    } else if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least one number');
      isValid = false;
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('Password must contain at least one special character');
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirm password is required');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      const success = await register(email, password, name);
      // Alert handling is now done in AuthContext
    } else {
      // Show validation errors using AlertService
      if (nameError) {
        AlertService.error(nameError, 'Validation Error');
      } else if (emailError) {
        AlertService.error(emailError, 'Validation Error');
      } else if (passwordError) {
        AlertService.error(passwordError, 'Validation Error');
      } else if (confirmPasswordError) {
        AlertService.error(confirmPasswordError, 'Validation Error');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Icon name="account" size={24} color={colors.primary} style={styles.inputIcon} />
          <Input
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            style={styles.input}
            error={nameError}
          />
        </View>
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <View style={styles.inputContainer}>
          <Icon name="email" size={24} color={colors.primary} style={styles.inputIcon} />
          <Input
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            error={emailError}
          />
        </View>
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color={colors.primary} style={styles.inputIcon} />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            style={styles.input}
            error={passwordError}
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Icon 
              name={passwordVisible ? "eye-off" : "eye"} 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        
        {password.length > 0 && (
          <View style={styles.passwordStrengthContainer}>
            <View style={styles.strengthBarContainer}>
              <Animated.View 
                style={[
                  styles.strengthBar, 
                  { 
                    width: `${25 * passwordStrength}%`,
                    backgroundColor: 
                      passwordStrength === 0 ? '#FF3B30' : 
                      passwordStrength === 1 ? '#FF9500' :
                      passwordStrength === 2 ? '#FFCC00' :
                      passwordStrength === 3 ? '#34C759' : '#30D158'
                  }
                ]} 
              />
            </View>
            <Text style={[
              styles.passwordFeedback,
              { 
                color: 
                  passwordStrength === 0 ? '#FF3B30' : 
                  passwordStrength === 1 ? '#FF9500' :
                  passwordStrength === 2 ? '#FFCC00' :
                  passwordStrength === 3 ? '#34C759' : '#30D158'
              }
            ]}>
              {passwordFeedback}
            </Text>
            <Text style={styles.passwordRequirements}>
              Password must contain at least 8 characters, one uppercase letter, one number, and one special character.
            </Text>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Icon name="lock-check" size={24} color={colors.primary} style={styles.inputIcon} />
          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
            style={styles.input}
            error={confirmPasswordError}
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <Icon 
              name={confirmPasswordVisible ? "eye-off" : "eye"} 
              size={24} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

        <Button 
          title="Register" 
          onPress={handleRegister} 
          loading={isLoading}
          style={styles.registerButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    position: 'relative',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginLeft: 34,
    marginBottom: 10,
  },
  registerButton: {
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  footerText: {
    opacity: 0.7,
  },
  footerLink: {
    fontWeight: '600',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
  passwordStrengthContainer: {
    marginLeft: 34,
    marginBottom: 15,
  },
  strengthBarContainer: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginBottom: 5,
    width: '100%',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  passwordFeedback: {
    fontSize: 12,
    marginBottom: 5,
    fontWeight: '600',
  },
  passwordRequirements: {
    fontSize: 11,
    color: '#8E8E93',
    lineHeight: 16,
  },
});

export default RegisterScreen;
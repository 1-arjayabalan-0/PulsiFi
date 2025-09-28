/**
 * PulseFi - Your Money's Daily Pulse
 * A financial management mobile app
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import our navigation and theme provider
import AppNavigator from './src/navigation/AppNavigator';
import ThemeProvider from './src/components/ThemeProvider';
import { AlertProvider, useAlert } from './src/context/AlertContext';
import { CurrencyProvider } from './src/context/CurrencyContext';
import AlertService from './src/utils/alert';

// Component to initialize AlertService with context methods
const AlertServiceInitializer = ({ children }) => {
  const alertMethods = useAlert();

  useEffect(() => {
    // Initialize AlertService with context methods
    AlertService.init(alertMethods);
  }, [alertMethods]);

  return children;
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <AlertProvider>
          <AlertServiceInitializer>
            <CurrencyProvider>
              <SafeAreaProvider>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="#FFFFFF" />
                <AppNavigator />
              </SafeAreaProvider>
            </CurrencyProvider>
          </AlertServiceInitializer>
        </AlertProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

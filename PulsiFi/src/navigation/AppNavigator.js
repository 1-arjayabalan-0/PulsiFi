import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthProvider, useAuth} from '../context/AuthContext';
import {AlertProvider} from '../context/AlertContext';
import CustomTabBar from '../components/CustomTabBar';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AddScreen from '../screens/AddScreen';
import InsightsScreen from '../screens/InsightsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddSubAccountScreen from '../screens/AddSubAccountScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import CreatePortfolioScreen from '../screens/CreatePortfolioScreen';
import CreateFirstPortfolioScreen from '../screens/CreateFirstPortfolioScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ToastTestScreen from '../screens/ToastTestScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main tab navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};



// Authentication navigator
const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Main app navigator with tab navigator and modal screens
const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="ToastTest"
        component={ToastTestScreen}
        options={{
          headerShown: true,
          headerTitle: 'Toast Test',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen
          name="AddSubAccount"
          component={AddSubAccountScreen}
          options={{
            headerShown: true,
            headerTitle: 'Add Sub-Account',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
          options={{
            headerShown: true,
            headerTitle: 'Add Transaction',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="CreatePortfolio"
          component={CreatePortfolioScreen}
          options={{
            headerShown: true,
            headerTitle: 'Create Portfolio',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

// First-time user navigator
const FirstTimeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="CreateFirstPortfolio"
        component={CreateFirstPortfolioScreen}
        options={{
          headerShown: true,
          headerTitle: 'Create Your Portfolio',
          headerTitleAlign: 'center',
          headerLeft: null, // Prevent going back
        }}
      />
    </Stack.Navigator>
  );
};

// Root navigator that switches between auth and app based on authentication state
const RootNavigator = () => {
  const {isAuthenticated, isFirstTimeUser} = useAuth();

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStack />
      ) : isFirstTimeUser ? (
        <FirstTimeStack />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
};

// Wrap the root navigator with the auth provider
const AppNavigator = () => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

export default AppNavigator;

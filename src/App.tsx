import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';

const App: React.FC = () => (
  <SafeAreaProvider>
    <StatusBar style="light" />
    <AppNavigator />
  </SafeAreaProvider>
);

export default App;

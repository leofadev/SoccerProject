import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { LeagueProvider } from './src/context/LeagueContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <LeagueProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </LeagueProvider>
  );
}

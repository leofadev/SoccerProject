import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TeamsScreen } from '../screens/TeamsScreen';
import { TeamFormScreen } from '../screens/TeamFormScreen';
import { PlayersScreen } from '../screens/PlayersScreen';
import { MatchesScreen } from '../screens/MatchesScreen';
import { StandingsScreen } from '../screens/StandingsScreen';
import { ScorersScreen } from '../screens/ScorersScreen';
import { DashboardScreen } from '../screens/DashboardScreen';

export type TeamsStackParamList = {
  TeamsList: undefined;
  TeamForm: { teamId?: string } | undefined;
};

const Tab = createBottomTabNavigator();
const TeamsStack = createNativeStackNavigator<TeamsStackParamList>();

const TeamsStackNavigator = () => (
  <TeamsStack.Navigator>
    <TeamsStack.Screen name="TeamsList" component={TeamsScreen} options={{ title: 'Equipos' }} />
    <TeamsStack.Screen name="TeamForm" component={TeamFormScreen} options={{ title: 'Crear/Editar equipo' }} />
  </TeamsStack.Navigator>
);

export const AppNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerStyle: { backgroundColor: '#07111f' }, headerTintColor: '#f8fafc', tabBarStyle: { backgroundColor: '#0f1d2f', borderTopColor: 'rgba(255,255,255,0.10)' }, tabBarActiveTintColor: '#34d399', tabBarInactiveTintColor: '#9fb3c8' }}>
      <Tab.Screen name="Inicio" component={DashboardScreen} />
      <Tab.Screen name="Equipos" component={TeamsStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Jugadores" component={PlayersScreen} />
      <Tab.Screen name="Partidos" component={MatchesScreen} />
      <Tab.Screen name="Tabla" component={StandingsScreen} />
      <Tab.Screen name="Goleadores" component={ScorersScreen} />
    </Tab.Navigator>
  );
};

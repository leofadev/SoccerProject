import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TeamsScreen } from '../screens/TeamsScreen';
import { TeamFormScreen } from '../screens/TeamFormScreen';
import { PlayersScreen } from '../screens/PlayersScreen';
import { MatchesScreen } from '../screens/MatchesScreen';
import { StandingsScreen } from '../screens/StandingsScreen';
import { ScorersScreen } from '../screens/ScorersScreen';

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
    <Tab.Navigator>
      <Tab.Screen name="Equipos" component={TeamsStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Jugadores" component={PlayersScreen} />
      <Tab.Screen name="Partidos" component={MatchesScreen} />
      <Tab.Screen name="Tabla" component={StandingsScreen} />
      <Tab.Screen name="Goleadores" component={ScorersScreen} />
    </Tab.Navigator>
  );
};

import React from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, PrimaryButton, Screen, Subtitle, Title } from '../components/ui';
import { useLeague } from '../context/LeagueContext';
import { TeamsStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme';

type Props = NativeStackScreenProps<TeamsStackParamList, 'TeamsList'>;

export const TeamsScreen: React.FC<Props> = ({ navigation }) => {
  const { state, loading } = useLeague();
  if (loading) return <Screen><Subtitle>Cargando liga...</Subtitle></Screen>;

  return (
    <Screen>
      <Title>Equipos</Title>
      <Subtitle>Administra clubes, ciudades y edición rápida.</Subtitle>
      <PrimaryButton label="+ Crear equipo" onPress={() => navigation.navigate('TeamForm')} />
      <FlatList
        data={state.teams}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Subtitle>No hay equipos registrados. Crea el primero para comenzar.</Subtitle>}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('TeamForm', { teamId: item.id })}>
            <Card style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.city}>{item.city || 'Ciudad no definida'}</Text>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  list: { paddingTop: 14, paddingBottom: 24 },
  card: { marginBottom: 12 },
  name: { color: colors.text, fontSize: 18, fontWeight: '900' },
  city: { color: colors.muted, marginTop: 4 },
});

import React, { useMemo, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text } from 'react-native';
import { Card, Field, Pill, PrimaryButton, Screen, Subtitle, Title } from '../components/ui';
import { useLeague } from '../context/LeagueContext';
import { colors } from '../theme';

export const PlayersScreen: React.FC = () => {
  const { state, addPlayer } = useLeague();
  const [teamId, setTeamId] = useState<string | null>(state.teams[0]?.id ?? null);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const playersByTeam = useMemo(() => state.teams.map((team) => ({ ...team, players: state.players.filter((p) => p.teamId === team.id).sort((a, b) => a.number - b.number) })), [state.teams, state.players]);

  const onAddPlayer = () => {
    const parsed = Number(number);
    if (!teamId) return Alert.alert('Validación', 'Primero crea y selecciona un equipo.');
    if (!name.trim() || Number.isNaN(parsed)) return Alert.alert('Validación', 'Ingresa nombre y dorsal numérico.');
    addPlayer(teamId, name.trim(), parsed);
    setName(''); setNumber('');
  };

  return (
    <Screen>
      <FlatList
        data={playersByTeam}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={(
          <>
            <Title>Plantillas</Title><Subtitle>Agrega dorsales y organiza jugadores por equipo.</Subtitle>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pills}>{state.teams.map((team) => <Pill key={team.id} label={team.name} active={team.id === teamId} onPress={() => setTeamId(team.id)} />)}</ScrollView>
            <Card style={styles.form}><Field placeholder="Nombre del jugador" value={name} onChangeText={setName} /><Field placeholder="Dorsal" keyboardType="numeric" value={number} onChangeText={setNumber} /><PrimaryButton label="Agregar jugador" onPress={onAddPlayer} /></Card>
          </>
        )}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => <Card style={styles.team}><Text style={styles.teamTitle}>{item.name}</Text>{item.players.length ? item.players.map((p) => <Text key={p.id} style={styles.player}>#{p.number} · {p.name}</Text>) : <Subtitle>Sin jugadores.</Subtitle>}</Card>}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({ content: { paddingBottom: 24 }, pills: { marginTop: 14 }, form: { marginVertical: 14 }, team: { marginBottom: 12 }, teamTitle: { color: colors.text, fontWeight: '900', fontSize: 18, marginBottom: 8 }, player: { color: colors.muted, paddingVertical: 3 } });

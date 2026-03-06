import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLeague } from '../context/LeagueContext';

export const PlayersScreen: React.FC = () => {
  const { state, addPlayer } = useLeague();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');

  const playersByTeam = useMemo(() => {
    return state.teams.map((team) => ({
      ...team,
      players: state.players.filter((p) => p.teamId === team.id),
    }));
  }, [state.teams, state.players]);

  const onAddPlayer = () => {
    if (!teamId) {
      Alert.alert('Validación', 'Primero selecciona un equipo tocando su nombre.');
      return;
    }
    const parsed = Number(number);
    if (!name.trim() || Number.isNaN(parsed)) {
      Alert.alert('Validación', 'Ingresa nombre y dorsal numérico.');
      return;
    }
    addPlayer(teamId, name.trim(), parsed);
    setName('');
    setNumber('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>Selecciona equipo:</Text>
      <FlatList
        horizontal
        data={state.teams}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
        renderItem={({ item }) => (
          <Text
            onPress={() => setTeamId(item.id)}
            style={[styles.teamPill, item.id === teamId && styles.teamPillActive]}
          >
            {item.name}
          </Text>
        )}
      />

      <View style={styles.formCard}>
        <TextInput placeholder="Nombre del jugador" value={name} onChangeText={setName} style={styles.input} />
        <TextInput
          placeholder="Dorsal"
          keyboardType="numeric"
          value={number}
          onChangeText={setNumber}
          style={styles.input}
        />
        <Pressable style={styles.primaryButton} onPress={onAddPlayer}>
          <Text style={styles.primaryButtonText}>Agregar jugador</Text>
        </Pressable>
      </View>

      <FlatList
        data={playersByTeam}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{item.name}</Text>
            {item.players.map((p) => (
              <Text key={p.id} style={styles.playerRow}>#{p.number} {p.name}</Text>
            ))}
            {item.players.length === 0 && <Text style={styles.emptyText}>Sin jugadores.</Text>}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8, backgroundColor: '#f4f7fb' },
  caption: { fontWeight: '700', color: '#102a43' },
  teamPill: {
    borderWidth: 1,
    borderColor: '#bcccdc',
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#fff',
    color: '#334e68',
  },
  teamPillActive: { backgroundColor: '#d9e8ff', borderColor: '#1363df', color: '#0b2f66' },
  formCard: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d9e2ec',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primaryButton: {
    backgroundColor: '#1363df',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  section: {
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  sectionTitle: { fontWeight: '700', color: '#102a43', marginBottom: 6 },
  playerRow: { color: '#243b53', paddingVertical: 2 },
  emptyText: { color: '#829ab1' },
});

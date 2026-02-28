import React, { useMemo, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
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
        renderItem={({ item }) => (
          <Text
            onPress={() => setTeamId(item.id)}
            style={[styles.teamPill, item.id === teamId && styles.teamPillActive]}
          >
            {item.name}
          </Text>
        )}
      />

      <TextInput placeholder="Nombre del jugador" value={name} onChangeText={setName} style={styles.input} />
      <TextInput
        placeholder="Dorsal"
        keyboardType="numeric"
        value={number}
        onChangeText={setNumber}
        style={styles.input}
      />
      <Button title="Agregar jugador" onPress={onAddPlayer} />

      <FlatList
        data={playersByTeam}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{item.name}</Text>
            {item.players.map((p) => (
              <Text key={p.id}>#{p.number} {p.name}</Text>
            ))}
            {item.players.length === 0 && <Text>Sin jugadores.</Text>}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  caption: { fontWeight: '700' },
  teamPill: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  teamPillActive: { backgroundColor: '#d8f0ff', borderColor: '#28a' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  sectionTitle: { fontWeight: '700' },
});

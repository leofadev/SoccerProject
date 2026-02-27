import React, { useMemo, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLeague } from '../context/LeagueContext';
import { MatchScorer } from '../types/models';

export const MatchesScreen: React.FC = () => {
  const { state, addMatch } = useLeague();
  const [homeTeamId, setHomeTeamId] = useState<string | null>(null);
  const [awayTeamId, setAwayTeamId] = useState<string | null>(null);
  const [homeGoals, setHomeGoals] = useState('0');
  const [awayGoals, setAwayGoals] = useState('0');

  // Ejemplo básico: carga goleadores de forma simple "playerId:goles,playerId:goles".
  const [scorersText, setScorersText] = useState('');

  const teams = state.teams;
  const teamName = useMemo(() => new Map(teams.map((t) => [t.id, t.name])), [teams]);

  const parseScorers = (): MatchScorer[] => {
    if (!scorersText.trim()) return [];

    return scorersText
      .split(',')
      .map((chunk) => chunk.trim())
      .filter(Boolean)
      .map((item) => {
        const [playerId, goals] = item.split(':');
        return {
          playerId: playerId.trim(),
          goals: Number(goals),
        };
      })
      .filter((s) => s.playerId && !Number.isNaN(s.goals) && s.goals > 0);
  };

  const onSaveMatch = () => {
    if (!homeTeamId || !awayTeamId || homeTeamId === awayTeamId) {
      Alert.alert('Validación', 'Selecciona dos equipos distintos.');
      return;
    }

    const hg = Number(homeGoals);
    const ag = Number(awayGoals);
    if (Number.isNaN(hg) || Number.isNaN(ag) || hg < 0 || ag < 0) {
      Alert.alert('Validación', 'Los goles deben ser números válidos >= 0.');
      return;
    }

    addMatch({
      date: new Date().toISOString(),
      homeTeamId,
      awayTeamId,
      homeGoals: hg,
      awayGoals: ag,
      scorers: parseScorers(),
    });

    setHomeGoals('0');
    setAwayGoals('0');
    setScorersText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>Equipo local (toca para seleccionar):</Text>
      <FlatList
        horizontal
        data={teams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={[styles.pill, homeTeamId === item.id && styles.active]} onPress={() => setHomeTeamId(item.id)}>
            {item.name}
          </Text>
        )}
      />

      <Text style={styles.caption}>Equipo visitante:</Text>
      <FlatList
        horizontal
        data={teams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={[styles.pill, awayTeamId === item.id && styles.active]} onPress={() => setAwayTeamId(item.id)}>
            {item.name}
          </Text>
        )}
      />

      <TextInput value={homeGoals} onChangeText={setHomeGoals} keyboardType="numeric" style={styles.input} placeholder="Goles local" />
      <TextInput value={awayGoals} onChangeText={setAwayGoals} keyboardType="numeric" style={styles.input} placeholder="Goles visitante" />
      <TextInput
        value={scorersText}
        onChangeText={setScorersText}
        style={styles.input}
        placeholder="Goleadores: playerId:goles,playerId:goles"
      />

      <Button title="Registrar partido" onPress={onSaveMatch} />

      <Text style={styles.caption}>Últimos partidos:</Text>
      <FlatList
        data={[...state.matches].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.matchLine}>
            {teamName.get(item.homeTeamId)} {item.homeGoals} - {item.awayGoals} {teamName.get(item.awayTeamId)}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  caption: { fontWeight: '700', marginTop: 8 },
  pill: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  active: { backgroundColor: '#d8f0ff', borderColor: '#28a' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  matchLine: { paddingVertical: 4 },
});

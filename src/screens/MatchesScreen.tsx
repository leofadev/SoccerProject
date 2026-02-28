import React, { useMemo, useState } from 'react';
import { Alert, Button, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLeague } from '../context/LeagueContext';
import { MatchScorer, Player } from '../types/models';

export const MatchesScreen: React.FC = () => {
  const { state, addMatch } = useLeague();
  const [homeTeamId, setHomeTeamId] = useState<string | null>(null);
  const [awayTeamId, setAwayTeamId] = useState<string | null>(null);
  const [homeGoals, setHomeGoals] = useState('0');
  const [awayGoals, setAwayGoals] = useState('0');

  // Mapa playerId -> goles anotados en el partido actual.
  const [scorerGoals, setScorerGoals] = useState<Record<string, number>>({});

  const teams = state.teams;

  const teamName = useMemo(() => new Map(teams.map((t) => [t.id, t.name])), [teams]);

  const homePlayers = useMemo(
    () => state.players.filter((player) => player.teamId === homeTeamId),
    [state.players, homeTeamId],
  );

  const awayPlayers = useMemo(
    () => state.players.filter((player) => player.teamId === awayTeamId),
    [state.players, awayTeamId],
  );

  const upsertPlayerGoal = (playerId: string, delta: number) => {
    setScorerGoals((prev) => {
      const current = prev[playerId] ?? 0;
      const nextValue = Math.max(0, current + delta);

      if (nextValue === 0) {
        const { [playerId]: _removed, ...rest } = prev;
        return rest;
      }

      return { ...prev, [playerId]: nextValue };
    });
  };

  const goalsForTeam = (players: Player[]) =>
    players.reduce((acc, player) => acc + (scorerGoals[player.id] ?? 0), 0);

  const buildScorers = (): MatchScorer[] => {
    return Object.entries(scorerGoals)
      .map(([playerId, goals]) => ({ playerId, goals }))
      .filter((entry) => entry.goals > 0);
  };

  const resetScorersForCurrentMatch = () => {
    setScorerGoals({});
  };

  const onSelectHomeTeam = (teamId: string) => {
    setHomeTeamId(teamId);
    resetScorersForCurrentMatch();
  };

  const onSelectAwayTeam = (teamId: string) => {
    setAwayTeamId(teamId);
    resetScorersForCurrentMatch();
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

    const homeScoredByPlayers = goalsForTeam(homePlayers);
    const awayScoredByPlayers = goalsForTeam(awayPlayers);

    // Validamos consistencia entre marcador y selección de goleadores.
    if (homeScoredByPlayers !== hg || awayScoredByPlayers !== ag) {
      Alert.alert(
        'Validación',
        `Los goleadores seleccionados no coinciden con el marcador.\n${teamName.get(homeTeamId)}: ${homeScoredByPlayers}/${hg}\n${teamName.get(awayTeamId)}: ${awayScoredByPlayers}/${ag}`,
      );
      return;
    }

    addMatch({
      date: new Date().toISOString(),
      homeTeamId,
      awayTeamId,
      homeGoals: hg,
      awayGoals: ag,
      scorers: buildScorers(),
    });

    setHomeGoals('0');
    setAwayGoals('0');
    setScorerGoals({});
  };

  const renderPlayerScorerSelector = (title: string, players: Player[]) => (
    <View style={styles.scorersBox}>
      <Text style={styles.caption}>{title}</Text>
      {players.length === 0 ? (
        <Text style={styles.helperText}>Este equipo no tiene jugadores registrados.</Text>
      ) : (
        players.map((player) => (
          <View key={player.id} style={styles.playerRow}>
            <Text style={styles.playerName}>#{player.number} {player.name}</Text>
            <View style={styles.counterBox}>
              <Text style={styles.counterButton} onPress={() => upsertPlayerGoal(player.id, -1)}>
                -
              </Text>
              <Text style={styles.counterValue}>{scorerGoals[player.id] ?? 0}</Text>
              <Text style={styles.counterButton} onPress={() => upsertPlayerGoal(player.id, 1)}>
                +
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.caption}>Equipo local (toca para seleccionar):</Text>
      <FlatList
        horizontal
        data={teams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={[styles.pill, homeTeamId === item.id && styles.active]} onPress={() => onSelectHomeTeam(item.id)}>
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
          <Text style={[styles.pill, awayTeamId === item.id && styles.active]} onPress={() => onSelectAwayTeam(item.id)}>
            {item.name}
          </Text>
        )}
      />

      <TextInput value={homeGoals} onChangeText={setHomeGoals} keyboardType="numeric" style={styles.input} placeholder="Goles local" />
      <TextInput value={awayGoals} onChangeText={setAwayGoals} keyboardType="numeric" style={styles.input} placeholder="Goles visitante" />

      {homeTeamId && renderPlayerScorerSelector(`Goleadores de ${teamName.get(homeTeamId)}`, homePlayers)}
      {awayTeamId && renderPlayerScorerSelector(`Goleadores de ${teamName.get(awayTeamId)}`, awayPlayers)}

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
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
  scorersBox: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  helperText: { color: '#666' },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  playerName: { flex: 1 },
  counterBox: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  counterButton: {
    borderWidth: 1,
    borderColor: '#bbb',
    minWidth: 28,
    textAlign: 'center',
    borderRadius: 4,
    fontWeight: '700',
    paddingVertical: 2,
  },
  counterValue: { minWidth: 20, textAlign: 'center', fontWeight: '700' },
  matchLine: { paddingVertical: 4 },
});

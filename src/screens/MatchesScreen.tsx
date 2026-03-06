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

  // Búsqueda por nombre para no listar plantillas completas grandes.
  const [homeSearch, setHomeSearch] = useState('');
  const [awaySearch, setAwaySearch] = useState('');

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

  const filteredHomePlayers = useMemo(() => {
    const query = homeSearch.trim().toLowerCase();
    if (!query) return [];
    return homePlayers.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 8);
  }, [homePlayers, homeSearch]);

  const filteredAwayPlayers = useMemo(() => {
    const query = awaySearch.trim().toLowerCase();
    if (!query) return [];
    return awayPlayers.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 8);
  }, [awayPlayers, awaySearch]);

  const playerById = useMemo(() => new Map(state.players.map((p) => [p.id, p])), [state.players]);

  // Al tocar un jugador, lo agregamos como goleador (sumando 1 gol).
  const addGoalToPlayer = (playerId: string, resetSearch?: () => void) => {
    setScorerGoals((prev) => ({ ...prev, [playerId]: (prev[playerId] ?? 0) + 1 }));
    resetSearch?.();
  };

  // Permite corregir rápido restando goles al jugador ya seleccionado.
  const removeGoalFromPlayer = (playerId: string) => {
    setScorerGoals((prev) => {
      const current = prev[playerId] ?? 0;
      const next = Math.max(0, current - 1);

      if (next === 0) {
        const { [playerId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [playerId]: next };
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
    setHomeSearch('');
    setAwaySearch('');
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

    if (homeScoredByPlayers !== hg || awayScoredByPlayers !== ag) {
      Alert.alert(
        'Validación',
        `Los goleadores seleccionados no coinciden con el marcador.
${teamName.get(homeTeamId)}: ${homeScoredByPlayers}/${hg}
${teamName.get(awayTeamId)}: ${awayScoredByPlayers}/${ag}`,
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
    resetScorersForCurrentMatch();
  };

  const renderPlayerSearchPicker = (
    title: string,
    players: Player[],
    search: string,
    onChangeSearch: (value: string) => void,
    filtered: Player[],
    onPick: (id: string) => void,
  ) => (
    <View style={styles.pickerBox}>
      <Text style={styles.caption}>{title}</Text>
      {players.length === 0 ? (
        <Text style={styles.helperText}>Este equipo no tiene jugadores registrados.</Text>
      ) : (
        <>
          <TextInput
            value={search}
            onChangeText={onChangeSearch}
            style={styles.input}
            placeholder="Buscar jugador por nombre"
          />
          {!search.trim() ? (
            <Text style={styles.helperText}>Escribe para buscar y seleccionar al goleador.</Text>
          ) : filtered.length === 0 ? (
            <Text style={styles.helperText}>No hay jugadores que coincidan con la búsqueda.</Text>
          ) : (
            <View style={styles.playersWrap}>
              {filtered.map((player) => (
                <Text key={player.id} style={styles.playerChip} onPress={() => onPick(player.id)}>
                  #{player.number} {player.name}
                </Text>
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );

  const selectedScorers = Object.entries(scorerGoals)
    .map(([playerId, goals]) => ({ player: playerById.get(playerId), playerId, goals }))
    .filter((entry) => entry.player && entry.goals > 0);

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

      {homeTeamId &&
        renderPlayerSearchPicker(
          `Buscar y seleccionar goleador de ${teamName.get(homeTeamId)}`,
          homePlayers,
          homeSearch,
          setHomeSearch,
          filteredHomePlayers,
          (playerId) => addGoalToPlayer(playerId, () => setHomeSearch('')),
        )}

      {awayTeamId &&
        renderPlayerSearchPicker(
          `Buscar y seleccionar goleador de ${teamName.get(awayTeamId)}`,
          awayPlayers,
          awaySearch,
          setAwaySearch,
          filteredAwayPlayers,
          (playerId) => addGoalToPlayer(playerId, () => setAwaySearch('')),
        )}

      <View style={styles.selectedBox}>
        <Text style={styles.caption}>Goleadores seleccionados (toca para quitar 1 gol):</Text>
        {selectedScorers.length === 0 ? (
          <Text style={styles.helperText}>No hay goleadores seleccionados.</Text>
        ) : (
          selectedScorers.map((entry) => (
            <Text key={entry.playerId} style={styles.selectedItem} onPress={() => removeGoalFromPlayer(entry.playerId)}>
              {entry.player?.name} ({teamName.get(entry.player?.teamId ?? '')}) - {entry.goals} gol(es)
            </Text>
          ))
        )}
      </View>

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
  pickerBox: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  playersWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  playerChip: {
    borderWidth: 1,
    borderColor: '#9ad',
    backgroundColor: '#eef7ff',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  selectedBox: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  selectedItem: { paddingVertical: 4, color: '#123' },
  helperText: { color: '#666' },
  matchLine: { paddingVertical: 4 },
});

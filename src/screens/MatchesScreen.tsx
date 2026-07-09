import React, { useMemo, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Field, Pill, PrimaryButton, Screen, Subtitle, Title } from '../components/ui';
import { useLeague } from '../context/LeagueContext';
import { MatchScorer, Player } from '../types/models';
import { colors } from '../theme';

export const MatchesScreen: React.FC = () => {
  const { state, addMatch } = useLeague();
  const [homeTeamId, setHomeTeamId] = useState<string | null>(null);
  const [awayTeamId, setAwayTeamId] = useState<string | null>(null);
  const [homeGoals, setHomeGoals] = useState('0');
  const [awayGoals, setAwayGoals] = useState('0');
  const [scorerGoals, setScorerGoals] = useState<Record<string, number>>({});

  const teamName = useMemo(() => new Map(state.teams.map((t) => [t.id, t.name])), [state.teams]);
  const playerById = useMemo(() => new Map(state.players.map((p) => [p.id, p])), [state.players]);
  const homePlayers = useMemo(() => state.players.filter((player) => player.teamId === homeTeamId), [state.players, homeTeamId]);
  const awayPlayers = useMemo(() => state.players.filter((player) => player.teamId === awayTeamId), [state.players, awayTeamId]);

  const resetScorers = () => setScorerGoals({});
  const selectHome = (id: string) => { setHomeTeamId(id); resetScorers(); };
  const selectAway = (id: string) => { setAwayTeamId(id); resetScorers(); };

  const addGoalToPlayer = (playerId: string) => setScorerGoals((prev) => ({ ...prev, [playerId]: (prev[playerId] ?? 0) + 1 }));
  const removeGoalFromPlayer = (playerId: string) => setScorerGoals((prev) => {
    const next = (prev[playerId] ?? 0) - 1;
    if (next <= 0) {
      const { [playerId]: _removed, ...rest } = prev;
      return rest;
    }
    return { ...prev, [playerId]: next };
  });

  const goalsForTeam = (players: Player[]) => players.reduce((total, player) => total + (scorerGoals[player.id] ?? 0), 0);
  const buildScorers = (): MatchScorer[] => Object.entries(scorerGoals).map(([playerId, goals]) => ({ playerId, goals })).filter((entry) => entry.goals > 0);
  const teamName = useMemo(() => new Map(state.teams.map((t) => [t.id, t.name])), [state.teams]);


  const save = () => {
    const hg = Number(homeGoals), ag = Number(awayGoals);
    if (!homeTeamId || !awayTeamId || homeTeamId === awayTeamId) return Alert.alert('Validación', 'Selecciona dos equipos distintos.');
    if (Number.isNaN(hg) || Number.isNaN(ag) || hg < 0 || ag < 0) return Alert.alert('Validación', 'Los goles deben ser válidos.');

    const homeScorersTotal = goalsForTeam(homePlayers);
    const awayScorersTotal = goalsForTeam(awayPlayers);
    if (homeScorersTotal !== hg || awayScorersTotal !== ag) {
      return Alert.alert('Validación', `Los goleadores no coinciden con el marcador.\n${teamName.get(homeTeamId)}: ${homeScorersTotal}/${hg}\n${teamName.get(awayTeamId)}: ${awayScorersTotal}/${ag}`);
    }

    addMatch({ date: new Date().toISOString(), homeTeamId, awayTeamId, homeGoals: hg, awayGoals: ag, scorers: buildScorers() });
    setHomeGoals('0');
    setAwayGoals('0');
    resetScorers();
  };

  const selectedScorers = Object.entries(scorerGoals)
    .map(([playerId, goals]) => ({ player: playerById.get(playerId), playerId, goals }))
    .filter((entry) => entry.player && entry.goals > 0);

  return (
    <Screen>
      <FlatList
        data={[...state.matches].reverse()}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={(
          <>
            <Title>Partidos</Title>
            <Subtitle>Registra marcador y goleadores para mantener tabla y ranking sincronizados.</Subtitle>
            <Card style={styles.form}>
              <Text style={styles.label}>Local</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>{state.teams.map((t) => <Pill key={t.id} label={t.name} active={homeTeamId === t.id} onPress={() => selectHome(t.id)} />)}</ScrollView>
              <Text style={styles.label}>Visitante</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>{state.teams.map((t) => <Pill key={t.id} label={t.name} active={awayTeamId === t.id} onPress={() => selectAway(t.id)} />)}</ScrollView>
              <View style={styles.scoreRow}><Field placeholder="Local" keyboardType="numeric" value={homeGoals} onChangeText={setHomeGoals} /><Field placeholder="Visitante" keyboardType="numeric" value={awayGoals} onChangeText={setAwayGoals} /></View>
              {homeTeamId && <PlayerPicker title={`Goles de ${teamName.get(homeTeamId)}`} players={homePlayers} scorerGoals={scorerGoals} onPick={addGoalToPlayer} />}
              {awayTeamId && <PlayerPicker title={`Goles de ${teamName.get(awayTeamId)}`} players={awayPlayers} scorerGoals={scorerGoals} onPick={addGoalToPlayer} />}
              <Text style={styles.label}>Goleadores seleccionados</Text>
              {selectedScorers.length === 0 ? <Subtitle>Toca jugadores para sumar goles.</Subtitle> : selectedScorers.map((entry) => <Text key={entry.playerId} style={styles.scorer} onPress={() => removeGoalFromPlayer(entry.playerId)}>{entry.player?.name} · {entry.goals} gol(es) · tocar para quitar</Text>)}
              <PrimaryButton label="Registrar partido" onPress={save} />
            </Card>
            <Text style={styles.sectionTitle}>Últimos resultados</Text>
          </>
        )}
        ListEmptyComponent={<Subtitle>No hay partidos registrados.</Subtitle>}
        renderItem={({ item }) => <Card style={styles.match}><Text style={styles.matchText}>{teamName.get(item.homeTeamId)} {item.homeGoals} - {item.awayGoals} {teamName.get(item.awayTeamId)}</Text><Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text></Card>}
      />
    </Screen>
  );
};

const PlayerPicker = ({ title, players, scorerGoals, onPick }: { title: string; players: Player[]; scorerGoals: Record<string, number>; onPick: (id: string) => void }) => (
  <View style={styles.playerBox}>
    <Text style={styles.label}>{title}</Text>
    {players.length === 0 ? <Subtitle>Este equipo todavía no tiene jugadores.</Subtitle> : <View style={styles.playerWrap}>{players.map((player) => <Pill key={player.id} label={`#${player.number} ${player.name}${scorerGoals[player.id] ? ` (${scorerGoals[player.id]})` : ''}`} active={!!scorerGoals[player.id]} onPress={() => onPick(player.id)} />)}</View>}
  </View>
);

const styles = StyleSheet.create({
  content: { paddingBottom: 24 },
  form: { marginTop: 14, marginBottom: 18 },
  label: { color: colors.text, fontWeight: '900', marginTop: 10, marginBottom: 8 },
  scoreRow: { flexDirection: 'row', gap: 10 },
  playerBox: { marginTop: 8 },
  playerWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  scorer: { color: colors.primary, paddingVertical: 4, fontWeight: '800' },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 10 },
  match: { marginBottom: 10 },
  matchText: { color: colors.text, fontWeight: '900', fontSize: 16 },
  date: { color: colors.muted, marginTop: 4 },
});

    addMatch({ date: new Date().toISOString(), homeTeamId, awayTeamId, homeGoals: hg, awayGoals: ag, scorers: [] });
    setHomeGoals('0'); setAwayGoals('0');
  };

  return <Screen><FlatList data={[...state.matches].reverse()} keyExtractor={(i) => i.id} contentContainerStyle={styles.content} ListHeaderComponent={<><Title>Partidos</Title><Subtitle>Registra marcadores rápido; la tabla se recalcula sola.</Subtitle><Card style={styles.form}><Text style={styles.label}>Local</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{state.teams.map((t) => <Pill key={t.id} label={t.name} active={homeTeamId === t.id} onPress={() => setHomeTeamId(t.id)} />)}</ScrollView><Text style={styles.label}>Visitante</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{state.teams.map((t) => <Pill key={t.id} label={t.name} active={awayTeamId === t.id} onPress={() => setAwayTeamId(t.id)} />)}</ScrollView><View style={styles.scoreRow}><Field placeholder="Local" keyboardType="numeric" value={homeGoals} onChangeText={setHomeGoals} /><Field placeholder="Visitante" keyboardType="numeric" value={awayGoals} onChangeText={setAwayGoals} /></View><PrimaryButton label="Registrar marcador" onPress={save} /></Card><Text style={styles.sectionTitle}>Últimos resultados</Text></>} ListEmptyComponent={<Subtitle>No hay partidos registrados.</Subtitle>} renderItem={({ item }) => <Card style={styles.match}><Text style={styles.matchText}>{teamName.get(item.homeTeamId)} {item.homeGoals} - {item.awayGoals} {teamName.get(item.awayTeamId)}</Text><Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text></Card>} /></Screen>;
};

const styles = StyleSheet.create({ content: { paddingBottom: 24 }, form: { marginTop: 14, marginBottom: 18 }, label: { color: colors.text, fontWeight: '900', marginTop: 10, marginBottom: 8 }, scoreRow: { flexDirection: 'row', gap: 10 }, sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 10 }, match: { marginBottom: 10 }, matchText: { color: colors.text, fontWeight: '900', fontSize: 16 }, date: { color: colors.muted, marginTop: 4 } });


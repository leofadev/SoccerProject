import React, { useMemo, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Field, Pill, PrimaryButton, Screen, Subtitle, Title } from '../components/ui';
import { useLeague } from '../context/LeagueContext';
import { colors } from '../theme';

export const MatchesScreen: React.FC = () => {
  const { state, addMatch } = useLeague();
  const [homeTeamId, setHomeTeamId] = useState<string | null>(null);
  const [awayTeamId, setAwayTeamId] = useState<string | null>(null);
  const [homeGoals, setHomeGoals] = useState('0');
  const [awayGoals, setAwayGoals] = useState('0');
  const teamName = useMemo(() => new Map(state.teams.map((t) => [t.id, t.name])), [state.teams]);

  const save = () => {
    const hg = Number(homeGoals), ag = Number(awayGoals);
    if (!homeTeamId || !awayTeamId || homeTeamId === awayTeamId) return Alert.alert('Validación', 'Selecciona dos equipos distintos.');
    if (Number.isNaN(hg) || Number.isNaN(ag) || hg < 0 || ag < 0) return Alert.alert('Validación', 'Los goles deben ser válidos.');
    addMatch({ date: new Date().toISOString(), homeTeamId, awayTeamId, homeGoals: hg, awayGoals: ag, scorers: [] });
    setHomeGoals('0'); setAwayGoals('0');
  };

  return <Screen><FlatList data={[...state.matches].reverse()} keyExtractor={(i) => i.id} contentContainerStyle={styles.content} ListHeaderComponent={<><Title>Partidos</Title><Subtitle>Registra marcadores rápido; la tabla se recalcula sola.</Subtitle><Card style={styles.form}><Text style={styles.label}>Local</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{state.teams.map((t) => <Pill key={t.id} label={t.name} active={homeTeamId === t.id} onPress={() => setHomeTeamId(t.id)} />)}</ScrollView><Text style={styles.label}>Visitante</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{state.teams.map((t) => <Pill key={t.id} label={t.name} active={awayTeamId === t.id} onPress={() => setAwayTeamId(t.id)} />)}</ScrollView><View style={styles.scoreRow}><Field placeholder="Local" keyboardType="numeric" value={homeGoals} onChangeText={setHomeGoals} /><Field placeholder="Visitante" keyboardType="numeric" value={awayGoals} onChangeText={setAwayGoals} /></View><PrimaryButton label="Registrar marcador" onPress={save} /></Card><Text style={styles.sectionTitle}>Últimos resultados</Text></>} ListEmptyComponent={<Subtitle>No hay partidos registrados.</Subtitle>} renderItem={({ item }) => <Card style={styles.match}><Text style={styles.matchText}>{teamName.get(item.homeTeamId)} {item.homeGoals} - {item.awayGoals} {teamName.get(item.awayTeamId)}</Text><Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text></Card>} /></Screen>;
};

const styles = StyleSheet.create({ content: { paddingBottom: 24 }, form: { marginTop: 14, marginBottom: 18 }, label: { color: colors.text, fontWeight: '900', marginTop: 10, marginBottom: 8 }, scoreRow: { flexDirection: 'row', gap: 10 }, sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 10 }, match: { marginBottom: 10 }, matchText: { color: colors.text, fontWeight: '900', fontSize: 16 }, date: { color: colors.muted, marginTop: 4 } });

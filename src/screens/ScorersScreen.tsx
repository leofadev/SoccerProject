import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Card, Screen, Subtitle, Title } from '../components/ui';
import { useLeague } from '../context/LeagueContext';
import { colors } from '../theme';

export const ScorersScreen: React.FC = () => {
  const { scorers } = useLeague();
  return <Screen><Title>Goleadores</Title><Subtitle>Ranking acumulado desde los partidos registrados.</Subtitle><FlatList data={scorers} keyExtractor={(i) => i.playerId} contentContainerStyle={styles.list} ListEmptyComponent={<Subtitle>No hay goleadores registrados aún.</Subtitle>} renderItem={({ item, index }) => <Card style={styles.row}><View><Text style={styles.name}>{index + 1}. {item.playerName}</Text><Text style={styles.team}>{item.teamName}</Text></View><Text style={styles.badge}>{item.goals} ⚽</Text></Card>} /></Screen>;
};
const styles = StyleSheet.create({ list: { paddingTop: 14, paddingBottom: 24 }, row: { marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, name: { color: colors.text, fontWeight: '900' }, team: { color: colors.muted, marginTop: 3 }, badge: { color: '#042014', backgroundColor: colors.primary, overflow: 'hidden', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, fontWeight: '900' } });

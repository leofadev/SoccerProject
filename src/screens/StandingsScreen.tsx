import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Card, Screen, Subtitle, Title } from '../components/ui';
import { useLeague } from '../context/LeagueContext';
import { colors } from '../theme';

export const StandingsScreen: React.FC = () => {
  const { standings } = useLeague();
  return <Screen><Title>Tabla</Title><Subtitle>Puntos, goles y desempates actualizados automáticamente.</Subtitle><FlatList data={standings} keyExtractor={(i) => i.teamId} contentContainerStyle={styles.list} ListEmptyComponent={<Subtitle>No hay datos para calcular tabla.</Subtitle>} renderItem={({ item, index }) => <Card style={styles.row}><Text style={styles.pos}>{index + 1}</Text><View style={styles.info}><Text style={styles.name}>{item.teamName}</Text><Text style={styles.meta}>PJ {item.played} · G {item.won} · E {item.drawn} · P {item.lost} · DG {item.goalDifference}</Text></View><Text style={styles.points}>{item.points}</Text></Card>} /></Screen>;
};
const styles = StyleSheet.create({ list: { paddingTop: 14, paddingBottom: 24 }, row: { marginBottom: 10, flexDirection: 'row', alignItems: 'center' }, pos: { color: colors.primary, fontSize: 22, fontWeight: '900', width: 34 }, info: { flex: 1 }, name: { color: colors.text, fontWeight: '900' }, meta: { color: colors.muted, marginTop: 3, fontSize: 12 }, points: { color: colors.text, fontSize: 22, fontWeight: '900' } });

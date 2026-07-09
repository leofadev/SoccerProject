import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, PrimaryButton, Screen, Subtitle, Title } from '../components/ui';
import { useLeague } from '../context/LeagueContext';
import { colors } from '../theme';

export const DashboardScreen: React.FC = () => {
  const { state, standings, scorers, resetLeague, loadDemoLeague } = useLeague();
  const leader = standings[0];
  const topScorer = scorers[0];

  const confirmReset = () => Alert.alert('Reiniciar liga', 'Esto borra equipos, jugadores y partidos guardados.', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Reiniciar', style: 'destructive', onPress: resetLeague },
  ]);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View>
          <Title>Tu liga, desde cero.</Title>
          <Subtitle>Un panel limpio para crear equipos, cargar plantillas, registrar marcadores y ver estadísticas al instante.</Subtitle>
        </View>
        <Card style={styles.hero}>
          <Text style={styles.heroKicker}>Resumen general</Text>
          <View style={styles.statsGrid}>
            <Stat label="Equipos" value={state.teams.length} />
            <Stat label="Jugadores" value={state.players.length} />
            <Stat label="Partidos" value={state.matches.length} />
          </View>
        </Card>
        <Card>
          <Text style={styles.sectionTitle}>Lo más importante</Text>
          <Text style={styles.line}>Líder: {leader ? `${leader.teamName} (${leader.points} pts)` : 'Sin tabla todavía'}</Text>
          <Text style={styles.line}>Goleador: {topScorer ? `${topScorer.playerName} (${topScorer.goals})` : 'Sin goles registrados'}</Text>
        </Card>
        <Card>
          <Text style={styles.sectionTitle}>Arranque rápido</Text>
          <Subtitle>Carga datos de ejemplo para probar la app o reinicia todo para empezar una liga real.</Subtitle>
          <PrimaryButton label="Cargar demo" onPress={loadDemoLeague} />
          <PrimaryButton label="Empezar desde cero" tone="danger" onPress={confirmReset} />
        </Card>
      </ScrollView>
    </Screen>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  content: { gap: 16, paddingBottom: 24 },
  hero: { backgroundColor: colors.cardAlt },
  heroKicker: { color: colors.primary, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  statsGrid: { flexDirection: 'row', gap: 10, marginTop: 14 },
  stat: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 12, alignItems: 'center' },
  statValue: { color: colors.text, fontSize: 26, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 12, marginTop: 2 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginBottom: 8 },
  line: { color: colors.muted, paddingVertical: 4 },
});

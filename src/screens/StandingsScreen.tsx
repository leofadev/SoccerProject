import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useLeague } from '../context/LeagueContext';

export const StandingsScreen: React.FC = () => {
  const { standings } = useLeague();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tabla de posiciones</Text>
      <FlatList
        data={standings}
        keyExtractor={(item) => item.teamId}
        ListEmptyComponent={<Text>No hay datos para calcular tabla.</Text>}
        renderItem={({ item, index }) => (
          <Text style={styles.row}>
            {index + 1}. {item.teamName} | PJ:{item.played} G:{item.won} E:{item.drawn} P:{item.lost} GF:{item.goalsFor} GC:{item.goalsAgainst} DG:{item.goalDifference} Pts:{item.points}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  row: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#eee' },
});

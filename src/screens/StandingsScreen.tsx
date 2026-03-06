import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useLeague } from '../context/LeagueContext';

export const StandingsScreen: React.FC = () => {
  const { standings } = useLeague();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tabla de posiciones</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.hCell, styles.nameCol]}>Equipo</Text>
        <Text style={styles.hCell}>PJ</Text>
        <Text style={styles.hCell}>DG</Text>
        <Text style={styles.hCell}>Pts</Text>
      </View>
      <FlatList
        data={standings}
        keyExtractor={(item) => item.teamId}
        ListEmptyComponent={<Text style={styles.empty}>No hay datos para calcular tabla.</Text>}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={[styles.cell, styles.nameCol]}>{index + 1}. {item.teamName}</Text>
            <Text style={styles.cell}>{item.played}</Text>
            <Text style={styles.cell}>{item.goalDifference}</Text>
            <Text style={[styles.cell, styles.points]}>{item.points}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f7fb' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 10, color: '#102a43' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d9e8ff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  hCell: { flex: 0.8, fontWeight: '700', color: '#102a43' },
  nameCol: { flex: 2.8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  cell: { flex: 0.8, color: '#243b53' },
  points: { fontWeight: '700', color: '#0b2f66' },
  empty: { marginTop: 12, color: '#829ab1' },
});

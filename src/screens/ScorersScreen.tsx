import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useLeague } from '../context/LeagueContext';

export const ScorersScreen: React.FC = () => {
  const { scorers } = useLeague();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ranking de goleadores</Text>
      <FlatList
        data={scorers}
        keyExtractor={(item) => item.playerId}
        ListEmptyComponent={<Text style={styles.empty}>No hay goleadores registrados aún.</Text>}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.name}>{index + 1}. {item.playerName}</Text>
              <Text style={styles.team}>{item.teamName}</Text>
            </View>
            <Text style={styles.badge}>{item.goals} ⚽</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f7fb' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 10, color: '#102a43' },
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontWeight: '700', color: '#102a43' },
  team: { color: '#486581', marginTop: 2 },
  badge: {
    backgroundColor: '#d9e8ff',
    color: '#0b2f66',
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  empty: { marginTop: 12, color: '#829ab1' },
});

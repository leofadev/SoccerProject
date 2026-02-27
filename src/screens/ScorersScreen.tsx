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
        ListEmptyComponent={<Text>No hay goleadores registrados aún.</Text>}
        renderItem={({ item, index }) => (
          <Text style={styles.row}>
            {index + 1}. {item.playerName} ({item.teamName}) - {item.goals} goles
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  row: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
});

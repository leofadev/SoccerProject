import React from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLeague } from '../context/LeagueContext';
import { TeamsStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<TeamsStackParamList, 'TeamsList'>;

export const TeamsScreen: React.FC<Props> = ({ navigation }) => {
  const { state, loading } = useLeague();

  if (loading) {
    return <Text style={styles.center}>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Button title="Crear equipo" onPress={() => navigation.navigate('TeamForm')} />
      <FlatList
        data={state.teams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TeamForm', { teamId: item.id })}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.city || 'Ciudad no definida'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.center}>No hay equipos registrados.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
  },
  title: { fontSize: 16, fontWeight: '700' },
  center: { textAlign: 'center', marginTop: 20 },
});

import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
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
      <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('TeamForm')}>
        <Text style={styles.primaryButtonText}>+ Crear equipo</Text>
      </Pressable>

      <FlatList
        data={state.teams}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('TeamForm', { teamId: item.id })}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.city || 'Ciudad no definida'}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.center}>No hay equipos registrados.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f7fb' },
  primaryButton: {
    backgroundColor: '#1363df',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
  listContent: { paddingBottom: 12 },
  card: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  title: { fontSize: 17, fontWeight: '700', color: '#102a43' },
  subtitle: { marginTop: 2, color: '#486581' },
  center: { textAlign: 'center', marginTop: 20, color: '#486581' },
});

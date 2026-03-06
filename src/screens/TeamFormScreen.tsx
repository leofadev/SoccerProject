import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLeague } from '../context/LeagueContext';
import { TeamsStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<TeamsStackParamList, 'TeamForm'>;

export const TeamFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { state, addTeam, editTeam } = useLeague();
  const team = useMemo(
    () => state.teams.find((t) => t.id === route.params?.teamId),
    [state.teams, route.params?.teamId],
  );

  const [name, setName] = useState(team?.name ?? '');
  const [city, setCity] = useState(team?.city ?? '');

  const onSave = () => {
    if (!name.trim()) {
      Alert.alert('Validación', 'El nombre del equipo es obligatorio.');
      return;
    }

    if (team) {
      editTeam(team.id, name.trim(), city.trim() || undefined);
    } else {
      addTeam(name.trim(), city.trim() || undefined);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{team ? 'Editar equipo' : 'Nuevo equipo'}</Text>
        <TextInput
          placeholder="Nombre del equipo"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput placeholder="Ciudad" value={city} onChangeText={setCity} style={styles.input} />

        <Pressable style={styles.primaryButton} onPress={onSave}>
          <Text style={styles.primaryButtonText}>Guardar</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f7fb' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    gap: 12,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#102a43' },
  input: {
    borderWidth: 1,
    borderColor: '#d9e2ec',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primaryButton: {
    backgroundColor: '#1363df',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700' },
});

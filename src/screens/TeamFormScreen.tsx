import React, { useMemo, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
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
      <TextInput
        placeholder="Nombre del equipo"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput placeholder="Ciudad" value={city} onChangeText={setCity} style={styles.input} />
      <Button title="Guardar" onPress={onSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
});

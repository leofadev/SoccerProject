import React, { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, Field, PrimaryButton, Screen, Subtitle, Title } from '../components/ui';
import { useLeague } from '../context/LeagueContext';
import { TeamsStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<TeamsStackParamList, 'TeamForm'>;

export const TeamFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { state, addTeam, editTeam } = useLeague();
  const team = useMemo(() => state.teams.find((t) => t.id === route.params?.teamId), [state.teams, route.params?.teamId]);
  const [name, setName] = useState(team?.name ?? '');
  const [city, setCity] = useState(team?.city ?? '');

  const onSave = () => {
    if (!name.trim()) return Alert.alert('Validación', 'El nombre del equipo es obligatorio.');
    team ? editTeam(team.id, name.trim(), city.trim() || undefined) : addTeam(name.trim(), city.trim() || undefined);
    navigation.goBack();
  };

  return (
    <Screen>
      <Card>
        <Title>{team ? 'Editar equipo' : 'Nuevo equipo'}</Title>
        <Subtitle>Dale identidad a cada club de tu torneo.</Subtitle>
        <Field placeholder="Nombre del equipo" value={name} onChangeText={setName} />
        <Field placeholder="Ciudad o barrio" value={city} onChangeText={setCity} />
        <PrimaryButton label="Guardar equipo" onPress={onSave} />
      </Card>
    </Screen>
  );
};

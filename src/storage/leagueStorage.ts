import AsyncStorage from '@react-native-async-storage/async-storage';
import { LeagueState } from '../types/models';

const LEAGUE_STORAGE_KEY = 'soccer_league_state_v1';

const INITIAL_STATE: LeagueState = {
  teams: [],
  players: [],
  matches: [],
};

// Carga el estado completo desde AsyncStorage.
export const loadLeagueState = async (): Promise<LeagueState> => {
  const raw = await AsyncStorage.getItem(LEAGUE_STORAGE_KEY);
  if (!raw) return INITIAL_STATE;

  try {
    const parsed = JSON.parse(raw) as LeagueState;
    return {
      teams: parsed.teams ?? [],
      players: parsed.players ?? [],
      matches: parsed.matches ?? [],
    };
  } catch {
    return INITIAL_STATE;
  }
};

// Guarda todo el estado en un único registro para simplificar consistencia.
export const saveLeagueState = async (state: LeagueState): Promise<void> => {
  await AsyncStorage.setItem(LEAGUE_STORAGE_KEY, JSON.stringify(state));
};

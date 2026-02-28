import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { loadLeagueState, saveLeagueState } from '../storage/leagueStorage';
import { calculateScorersRanking, calculateStandings } from '../utils/standings';
import { LeagueState, Match, MatchScorer, Player, ScorerEntry, Team, TeamStanding } from '../types/models';

type LeagueContextValue = {
  state: LeagueState;
  loading: boolean;
  standings: TeamStanding[];
  scorers: ScorerEntry[];
  addTeam: (name: string, city?: string) => void;
  editTeam: (id: string, name: string, city?: string) => void;
  addPlayer: (teamId: string, name: string, number: number) => void;
  addMatch: (payload: Omit<Match, 'id' | 'scorers'> & { scorers?: MatchScorer[] }) => void;
};

const LeagueContext = createContext<LeagueContextValue | undefined>(undefined);

const EMPTY_STATE: LeagueState = { teams: [], players: [], matches: [] };

export const LeagueProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<LeagueState>(EMPTY_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const persisted = await loadLeagueState();
      setState(persisted);
      setLoading(false);
    })();
  }, []);

  // Persistencia automática al cambiar el estado.
  useEffect(() => {
    if (!loading) {
      saveLeagueState(state);
    }
  }, [state, loading]);

  const addTeam = useCallback((name: string, city?: string) => {
    const newTeam: Team = { id: uuid(), name, city };
    setState((prev) => ({ ...prev, teams: [...prev.teams, newTeam] }));
  }, []);

  const editTeam = useCallback((id: string, name: string, city?: string) => {
    setState((prev) => ({
      ...prev,
      teams: prev.teams.map((team) => (team.id === id ? { ...team, name, city } : team)),
    }));
  }, []);

  const addPlayer = useCallback((teamId: string, name: string, number: number) => {
    const newPlayer: Player = { id: uuid(), teamId, name, number };
    setState((prev) => ({ ...prev, players: [...prev.players, newPlayer] }));
  }, []);

  const addMatch = useCallback((payload: Omit<Match, 'id' | 'scorers'> & { scorers?: MatchScorer[] }) => {
    const newMatch: Match = {
      id: uuid(),
      ...payload,
      scorers: payload.scorers ?? [],
    };
    setState((prev) => ({ ...prev, matches: [...prev.matches, newMatch] }));
  }, []);

  const standings = useMemo(() => calculateStandings(state), [state]);
  const scorers = useMemo(() => calculateScorersRanking(state), [state]);

  const value = useMemo(
    () => ({
      state,
      loading,
      standings,
      scorers,
      addTeam,
      editTeam,
      addPlayer,
      addMatch,
    }),
    [state, loading, standings, scorers, addTeam, editTeam, addPlayer, addMatch],
  );

  return <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>;
};

export const useLeague = (): LeagueContextValue => {
  const ctx = useContext(LeagueContext);
  if (!ctx) throw new Error('useLeague debe usarse dentro de LeagueProvider');
  return ctx;
};

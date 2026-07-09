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
  resetLeague: () => void;
  loadDemoLeague: () => void;
};

const LeagueContext = createContext<LeagueContextValue | undefined>(undefined);

const EMPTY_STATE: LeagueState = { teams: [], players: [], matches: [] };

const DEMO_STATE: LeagueState = {
  teams: [
    { id: 'demo-lions', name: 'Leones FC', city: 'Norte' },
    { id: 'demo-titans', name: 'Titanes', city: 'Centro' },
    { id: 'demo-river', name: 'Río Azul', city: 'Sur' },
  ],
  players: [
    { id: 'demo-p1', teamId: 'demo-lions', name: 'Mateo Cruz', number: 10 },
    { id: 'demo-p2', teamId: 'demo-lions', name: 'Leo Ramos', number: 7 },
    { id: 'demo-p3', teamId: 'demo-titans', name: 'Nico Vega', number: 9 },
    { id: 'demo-p4', teamId: 'demo-river', name: 'Santi Mora', number: 11 },
  ],
  matches: [
    { id: 'demo-m1', date: new Date().toISOString(), homeTeamId: 'demo-lions', awayTeamId: 'demo-titans', homeGoals: 2, awayGoals: 1, scorers: [{ playerId: 'demo-p1', goals: 1 }, { playerId: 'demo-p2', goals: 1 }, { playerId: 'demo-p3', goals: 1 }] },
    { id: 'demo-m2', date: new Date().toISOString(), homeTeamId: 'demo-river', awayTeamId: 'demo-lions', homeGoals: 1, awayGoals: 1, scorers: [{ playerId: 'demo-p4', goals: 1 }, { playerId: 'demo-p1', goals: 1 }] },
  ],
};

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

  const resetLeague = useCallback(() => setState(EMPTY_STATE), []);
  const loadDemoLeague = useCallback(() => setState(DEMO_STATE), []);

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
      resetLeague,
      loadDemoLeague,
    }),
    [state, loading, standings, scorers, addTeam, editTeam, addPlayer, addMatch, resetLeague, loadDemoLeague],
  );

  return <LeagueContext.Provider value={value}>{children}</LeagueContext.Provider>;
};

export const useLeague = (): LeagueContextValue => {
  const ctx = useContext(LeagueContext);
  if (!ctx) throw new Error('useLeague debe usarse dentro de LeagueProvider');
  return ctx;
};

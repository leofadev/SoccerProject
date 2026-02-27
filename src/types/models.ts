// Modelos principales de la app.
export type Team = {
  id: string;
  name: string;
  city?: string;
};

export type Player = {
  id: string;
  teamId: string;
  name: string;
  number: number;
};

export type MatchScorer = {
  playerId: string;
  goals: number;
};

export type Match = {
  id: string;
  date: string;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number;
  awayGoals: number;
  scorers: MatchScorer[];
};

export type LeagueState = {
  teams: Team[];
  players: Player[];
  matches: Match[];
};

export type TeamStanding = {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export type ScorerEntry = {
  playerId: string;
  playerName: string;
  teamName: string;
  goals: number;
};

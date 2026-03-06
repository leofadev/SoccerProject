import { LeagueState, ScorerEntry, TeamStanding } from '../types/models';

// Calcula la tabla con reglas estándar: 3 por victoria, 1 empate, 0 derrota.
export const calculateStandings = (state: LeagueState): TeamStanding[] => {
  const base = new Map<string, TeamStanding>();

  state.teams.forEach((team) => {
    base.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    });
  });

  state.matches.forEach((match) => {
    const home = base.get(match.homeTeamId);
    const away = base.get(match.awayTeamId);
    if (!home || !away) return;

    home.played += 1;
    away.played += 1;

    home.goalsFor += match.homeGoals;
    home.goalsAgainst += match.awayGoals;

    away.goalsFor += match.awayGoals;
    away.goalsAgainst += match.homeGoals;

    if (match.homeGoals > match.awayGoals) {
      home.won += 1;
      home.points += 3;
      away.lost += 1;
    } else if (match.homeGoals < match.awayGoals) {
      away.won += 1;
      away.points += 3;
      home.lost += 1;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  });

  const rows = Array.from(base.values()).map((row) => ({
    ...row,
    goalDifference: row.goalsFor - row.goalsAgainst,
  }));

  // Desempates: puntos, diferencia de gol, goles a favor, nombre.
  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    return a.teamName.localeCompare(b.teamName);
  });

  return rows;
};

// Recorre goleadores válidos en cada partido y crea ranking acumulado.
export const calculateScorersRanking = (state: LeagueState): ScorerEntry[] => {
  const goalsMap = new Map<string, number>();
  const teamById = new Map(state.teams.map((t) => [t.id, t.name]));
  const playerById = new Map(state.players.map((p) => [p.id, p]));

  state.matches.forEach((match) => {
    match.scorers.forEach((s) => {
      const player = playerById.get(s.playerId);

      // Si el jugador no existe en catálogo, omitimos ese registro para evitar
      // mensajes confusos como "Jugador eliminado (Sin equipo)".
      if (!player) return;

      goalsMap.set(s.playerId, (goalsMap.get(s.playerId) ?? 0) + s.goals);
    });
  });

  const ranking: ScorerEntry[] = Array.from(goalsMap.entries())
    .map(([playerId, goals]) => {
      const player = playerById.get(playerId);
      if (!player) return null;

      return {
        playerId,
        playerName: player.name,
        teamName: teamById.get(player.teamId) ?? 'Equipo no disponible',
        goals,
      };
    })
    .filter((entry): entry is ScorerEntry => entry !== null)
    .sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      return a.playerName.localeCompare(b.playerName);
    });

  return ranking;
};

# SoccerProject - Liga de Fútbol (React Native)

Aplicación móvil base para gestionar una liga de fútbol con React Native + Expo.

## 1) Estructura del proyecto

```txt
.
├── App.tsx
├── package.json
├── tsconfig.json
└── src
    ├── context
    │   └── LeagueContext.tsx
    ├── navigation
    │   └── AppNavigator.tsx
    ├── screens
    │   ├── MatchesScreen.tsx
    │   ├── PlayersScreen.tsx
    │   ├── ScorersScreen.tsx
    │   ├── StandingsScreen.tsx
    │   ├── TeamFormScreen.tsx
    │   └── TeamsScreen.tsx
    ├── storage
    │   └── leagueStorage.ts
    ├── types
    │   └── models.ts
    └── utils
        └── standings.ts
```

## 2) Modelo de datos

Definido en `src/types/models.ts`:

- `Team`: equipo.
- `Player`: jugador asociado a un equipo.
- `Match`: partido con marcador y lista de goleadores.
- `LeagueState`: estado global (`teams`, `players`, `matches`).
- `TeamStanding`: fila de tabla de posiciones.
- `ScorerEntry`: fila de ranking de goleadores.

## 3) Componentes principales

- `LeagueProvider` (`src/context/LeagueContext.tsx`):
  - Estado global de liga.
  - Acciones para crear/editar equipos, registrar jugadores, registrar partidos.
  - Cálculo memoizado de tabla y goleadores.
  - Persistencia automática con AsyncStorage.
- Navegación (`src/navigation/AppNavigator.tsx`):
  - Tabs: Equipos, Jugadores, Partidos, Tabla, Goleadores.
  - Stack interno para lista y formulario de equipos.
- Pantallas (`src/screens/*`):
  - `TeamsScreen` / `TeamFormScreen`
  - `PlayersScreen`
  - `MatchesScreen`
  - `StandingsScreen`
  - `ScorersScreen`

## 4) Lógica de cálculo de la tabla

Implementada en `src/utils/standings.ts`:

- Reglas de puntos:
  - Victoria: 3
  - Empate: 1
  - Derrota: 0
- Calcula por equipo:
  - PJ, G, E, P
  - GF, GC, DG
  - Puntos
- Ordenamiento:
  1. Puntos
  2. Diferencia de gol
  3. Goles a favor
  4. Nombre de equipo

También incluye `calculateScorersRanking` para ranking de goleadores acumulados.

## 5) Ejemplo de integración con almacenamiento local (AsyncStorage)

Archivo `src/storage/leagueStorage.ts`:

- `loadLeagueState()`
  - Lee `soccer_league_state_v1`
  - Hace parse seguro y devuelve estado inicial si falla.
- `saveLeagueState(state)`
  - Serializa estado completo y lo guarda.

En `LeagueContext`:

- Al iniciar, carga datos persistidos.
- Cada vez que cambia el estado y terminó la carga inicial, persiste automáticamente.

## Instalación rápida

```bash
npm install
npm run start
```

> Nota: en la pantalla de partidos, el campo de goleadores usa formato rápido:
> `playerId:goles,playerId:goles`
> como ejemplo mínimo de captura de goleadores.

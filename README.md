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
  - En `Partidos`, la carga de goleadores se hace buscando al jugador por nombre y seleccionándolo (sin usar IDs manuales), ideal para plantillas grandes.
  - La validación obliga a que la suma de goles por jugadores coincida con el marcador cargado.

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

## 6) Ya creé mi espacio en GitHub: ¿cómo lo conecto?

Si ya tienes tu repositorio en GitHub, ejecuta:

```bash
git init
git add .
git commit -m "Inicializa app de liga de fútbol"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

Si el remoto ya existe y quieres verificar:

```bash
git remote -v
```

## 7) ¿Qué debo hacer para que corra la app en el navegador?

### Requisitos

- Node.js LTS (recomendado: 18 o 20).
- npm 9+.

### Pasos

```bash
npm install
npm run web
```

También puedes usar:

```bash
npm run start
```

Y luego presionar `w` en la consola de Expo para abrir versión web.

### ¿Qué debería pasar?

- Expo levanta un servidor local.
- Se abre el navegador en `http://localhost:8081` (o puerto similar).
- Podrás navegar por tabs: Equipos, Jugadores, Partidos, Tabla, Goleadores.

### Problemas comunes

1. **Error 403 al instalar paquetes (`npm install`)**
   - Suele ocurrir por proxy/red corporativa.
   - Revisa configuración:

   ```bash
   npm config get registry
   npm config get proxy
   npm config get https-proxy
   ```

   - Debe apuntar a `https://registry.npmjs.org/`.

2. **Puerto ocupado**
   - Expo te ofrecerá cambiar de puerto automáticamente.

3. **Dependencias no instaladas**
   - Si falla instalación, la app no podrá arrancar ni hacer typecheck.

## Instalación rápida

```bash
npm install
npm run web
```

> Nota: en la pantalla de partidos, el campo de goleadores usa formato rápido:
> `playerId:goles,playerId:goles`
> como ejemplo mínimo de captura de goleadores.

# Oxford Dynamics - Mission Control

A compact React + Vite control surface that tracks upcoming launches, keeps a readiness board in sync, and ships with routing, shared state, API integration, and production guardrails.

## Getting started

```bash
npm install
npm run dev
```

The app pulls live data from the public SpaceX API; no local mocks required.

## Architecture

Component tree, routing, state management, and data flow at a glance:

```text
App.tsx
`-- React Router (lazy routes + Suspense fallback)
    |-- Layout (navigation shell + footer)
    |-- Dashboard (focus mission metrics)
    |   `-- LaunchCard (overview + actions)
    |-- Missions (manifest + pinning)
    `-- Analytics (readiness sliders)
         |-- useUpcomingLaunches hook --> launchService (SpaceX REST API)
         `-- missionStore (Zustand, persisted) <-- pinned/readiness state shared across pages
```

- **Routing**: Each top-level page is code-split via `React.lazy`, keeping the initial bundle lean and only streaming the route a pilot actually opens.
- **State**: `missionStore` (Zustand + persistence) centralizes pinned missions, the focused launch, and readiness metrics so Dashboard, Manifest, and Analytics stay in lockstep.
- **Data flow**: `useUpcomingLaunches` fetches and caches telemetry, components render declaratively, and user actions push updates to the store-no prop-drilling.

## Snippets & reasoning

### Custom hook - resilient API polling

```ts
// src/hooks/useUpcomingLaunches.ts
const STALE_TIME = 1000 * 60 * 5

export function useUpcomingLaunches() {
  const [launches, setLaunches] = useState<Launch[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const cacheRef = useRef<{ timestamp: number; data: Launch[] } | null>(null)

  const refresh = useCallback(async ({ silent } = {}) => {
    if (!silent) setStatus('loading')
    if (cacheRef.current && Date.now() - cacheRef.current.timestamp < STALE_TIME && silent) {
      setLaunches(cacheRef.current.data)
      setStatus('success')
      return
    }
    const data = await fetchUpcomingLaunches()
    cacheRef.current = { data, timestamp: Date.now() }
    setLaunches(data)
    setStatus('success')
  }, [])
}
```
*Why*: encapsulates fetch/caching/refresh semantics once, making every page resilient to flaky networks and preventing redundant API calls within a five-minute window.

### State management - mission control in one store

```ts
// src/store/missionStore.ts
export const useMissionStore = create<MissionState>()(persist((set, get) => ({
  pinnedMissionIds: [],
  readinessByMission: {},
  selectedMissionId: null,
  togglePin: (id) => set((state) => ({
    pinnedMissionIds: state.pinnedMissionIds.includes(id)
      ? state.pinnedMissionIds.filter((missionId) => missionId !== id)
      : [...state.pinnedMissionIds, id],
  })),
  ensureReadiness: (id) => {
    const current = get().readinessByMission[id]
    if (typeof current === 'number') return current
    const seeded = clamp(70 + (Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 25))
    set((state) => ({ readinessByMission: { ...state.readinessByMission, [id]: seeded } }))
    return seeded
  },
})))
```
*Why*: one source of truth for mission pins, focus selection, and readiness sliders keeps UX consistent, survives reloads via persistence, and avoids Redux-level ceremony.

## Performance

- **Measurement**: `reportWebVitals` wires `onCLS`, `onINP`, and `onLCP` into the console (or an analytics endpoint later) so regressions surface immediately during staging; `npm run build` (Vite/ESBuild) is used to inspect bundle output.
- **Concrete optimisation**: route-level `React.lazy` + Suspense combined with the cached `useUpcomingLaunches` hook reduces the initial JS payload and avoids duplicate network trips, cutting Time-to-Interactive for the default dashboard.

## Lessons learned

Next time I'll add contract tests around the SpaceX payload shape so schema drift can't silently break the manifest renderer.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MissionState {
  pinnedMissionIds: string[]
  readinessByMission: Record<string, number>
  selectedMissionId: string | null
  togglePin: (id: string) => void
  setReadiness: (id: string, score: number) => void
  ensureReadiness: (id: string) => number
  selectMission: (id: string | null) => void
}

const clamp = (score: number) => Math.max(60, Math.min(100, Math.round(score)))

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      pinnedMissionIds: [],
      readinessByMission: {},
      selectedMissionId: null,
      togglePin: (id: string) =>
        set((state) => {
          const isPinned = state.pinnedMissionIds.includes(id)
          return {
            pinnedMissionIds: isPinned
              ? state.pinnedMissionIds.filter((missionId) => missionId !== id)
              : [...state.pinnedMissionIds, id],
          }
        }),
      setReadiness: (id: string, score: number) =>
        set((state) => ({
          readinessByMission: {
            ...state.readinessByMission,
            [id]: clamp(score),
          },
        })),
      ensureReadiness: (id: string) => {
        const current = get().readinessByMission[id]
        if (typeof current === 'number') {
          return current
        }
        const seeded = clamp(70 + (Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 25))
        set((state) => ({
          readinessByMission: {
            ...state.readinessByMission,
            [id]: seeded,
          },
        }))
        return seeded
      },
      selectMission: (id: string | null) => set({ selectedMissionId: id }),
    }),
    { name: 'mission-state' },
  ),
)

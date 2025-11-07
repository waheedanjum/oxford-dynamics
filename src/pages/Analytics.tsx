import { useMemo } from 'react'
import { useUpcomingLaunches } from '../hooks/useUpcomingLaunches'
import { useMissionStore } from '../store/missionStore'

function Analytics() {
  const { launches } = useUpcomingLaunches()
  const { pinnedMissionIds, readinessByMission, ensureReadiness, setReadiness } =
    useMissionStore((state) => ({
      pinnedMissionIds: state.pinnedMissionIds,
      readinessByMission: state.readinessByMission,
      ensureReadiness: state.ensureReadiness,
      setReadiness: state.setReadiness,
    }))

  const trackedMissions = useMemo(
    () => launches.filter((launch) => pinnedMissionIds.includes(launch.id)),
    [launches, pinnedMissionIds],
  )

  const averageReadiness = useMemo(() => {
    if (!trackedMissions.length) {
      return null
    }
    const sum = trackedMissions.reduce((total, launch) => {
      const score = readinessByMission[launch.id] ?? ensureReadiness(launch.id)
      return total + score
    }, 0)
    return Math.round(sum / trackedMissions.length)
  }, [trackedMissions, readinessByMission, ensureReadiness])

  return (
    <section className="panel">
      <div className="panel__heading">
        <div>
          <p className="eyebrow">Systems</p>
          <h2>Analytics & readiness</h2>
        </div>
        <div className="metric-cluster">
          <div>
            <p className="metric-label">Tracked missions</p>
            <p className="metric-value">{trackedMissions.length}</p>
          </div>
          <div>
            <p className="metric-label">Avg readiness</p>
            <p className="metric-value">{averageReadiness ?? '--'}%</p>
          </div>
        </div>
      </div>

      {!trackedMissions.length && (
        <p className="muted">
          Pin missions from the manifest to start shaping readiness targets.
        </p>
      )}

      <div className="analytics-list">
        {trackedMissions.map((mission) => {
          const score = readinessByMission[mission.id] ?? ensureReadiness(mission.id)
          return (
            <div key={mission.id} className="analytics-card">
              <div>
                <p className="eyebrow">{mission.name}</p>
                <p className="analytics-card__details">{mission.details}</p>
              </div>
              <div className="analytics-card__controls">
                <span>{score}%</span>
                <input
                  type="range"
                  min={60}
                  max={100}
                  value={score}
                  onChange={(event) => setReadiness(mission.id, Number(event.target.value))}
                  aria-label={`Adjust readiness for ${mission.name}`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Analytics

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import LaunchCard from '../components/LaunchCard'
import { useUpcomingLaunches } from '../hooks/useUpcomingLaunches'
import { useMissionStore } from '../store/missionStore'

function Dashboard() {
  const { launches, status, error, nextLaunch, refresh } = useUpcomingLaunches()
  // Use individual selectors instead of returning a new object from a single
  // selector. Returning an object literal causes a new reference on every
  // snapshot which can trigger React's useSyncExternalStore to re-subscribe
  // repeatedly and lead to the "getSnapshot should be cached" / infinite
  // update loop. Selecting values individually prevents that.
  const pinnedMissionIds = useMissionStore((s) => s.pinnedMissionIds)
  const togglePin = useMissionStore((s) => s.togglePin)
  const ensureReadiness = useMissionStore((s) => s.ensureReadiness)
  const selectedMissionId = useMissionStore((s) => s.selectedMissionId)
  const selectMission = useMissionStore((s) => s.selectMission)

  const highlightedMission = useMemo(() => {
    if (!launches.length) {
      return undefined
    }
    if (selectedMissionId) {
      return launches.find((launch) => launch.id === selectedMissionId) ?? launches[0]
    }
    if (pinnedMissionIds.length > 0) {
      return launches.find((launch) => pinnedMissionIds.includes(launch.id)) ?? launches[0]
    }
    return launches[0]
  }, [launches, pinnedMissionIds, selectedMissionId])

  const readinessScore = highlightedMission
    ? ensureReadiness(highlightedMission.id)
    : undefined

  return (
    <section className="panel-grid">
      <article className="panel panel--hero">
        <div>
          <p className="eyebrow">Mission of focus</p>
          <h2>{highlightedMission ? highlightedMission.name : 'Awaiting manifest'}</h2>
          {highlightedMission && (
            <p className="panel__lead">{highlightedMission.details}</p>
          )}
        </div>

        <div className="metric-cluster">
          <div>
            <p className="metric-label">Readiness</p>
            <p className="metric-value">
              {readinessScore ? `${readinessScore}%` : '--'}
            </p>
          </div>
          <div>
            <p className="metric-label">Pinned missions</p>
            <p className="metric-value">{pinnedMissionIds.length}</p>
          </div>
          <div>
            <p className="metric-label">Next launch</p>
            <p className="metric-value">
              {nextLaunch
                ? new Intl.DateTimeFormat('en', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(nextLaunch.date_utc))
                : 'TBC'}
            </p>
          </div>
        </div>

        <div className="panel__actions">
          {highlightedMission && (
            <button
              type="button"
              className="button"
              onClick={() => selectMission(null)}
            >
              Clear focus
            </button>
          )}
          <Link className="button button--ghost" to="/missions">
            Review manifest
          </Link>
        </div>
      </article>

      <article className="panel">
        <div className="panel__heading">
          <div>
            <p className="eyebrow">Live manifest</p>
            <h2>Upcoming launches</h2>
          </div>
          <button type="button" className="button button--ghost" onClick={() => refresh()}>
            Hard refresh
          </button>
        </div>

        {status === 'loading' && <p className="muted">Syncing with launchpad...</p>}
        {status === 'error' && <p className="error">{error}</p>}

        <div className="launch-list">
          {launches.map((launch) => (
            <LaunchCard
              key={launch.id}
              launch={launch}
              isPinned={pinnedMissionIds.includes(launch.id)}
              onPinToggle={togglePin}
              onSelect={(id) => selectMission(id)}
            />
          ))}
        </div>
      </article>
    </section>
  )
}

export default Dashboard

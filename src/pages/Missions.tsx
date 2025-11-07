import LaunchCard from '../components/LaunchCard'
import { useUpcomingLaunches } from '../hooks/useUpcomingLaunches'
import { useMissionStore } from '../store/missionStore'

function Missions() {
  const { launches, status, error, refresh } = useUpcomingLaunches()
  const { pinnedMissionIds, togglePin, selectMission } = useMissionStore((state) => ({
    pinnedMissionIds: state.pinnedMissionIds,
    togglePin: state.togglePin,
    selectMission: state.selectMission,
  }))

  return (
    <section className="panel">
      <div className="panel__heading">
        <div>
          <p className="eyebrow">Planning</p>
          <h2>Mission manifest</h2>
        </div>
        <button type="button" className="button" onClick={() => refresh()}>
          Refresh feed
        </button>
      </div>

      {status === 'loading' && <p className="muted">Fetching manifest...</p>}
      {error && <p className="error">{error}</p>}
      {!launches.length && status === 'success' && <p>No launches returned from API.</p>}

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
    </section>
  )
}

export default Missions

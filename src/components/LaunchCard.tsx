import type { Launch } from '../types/launch'

interface LaunchCardProps {
  launch: Launch
  isPinned: boolean
  onPinToggle: (launchId: string) => void
  onSelect?: (launchId: string) => void
}

function LaunchCard({ launch, isPinned, onPinToggle, onSelect }: LaunchCardProps) {
  const formattedDate = new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(launch.date_utc))

  return (
    <article className="launch-card">
      <div className="launch-card__heading">
        <div>
          <p className="eyebrow">Upcoming launch</p>
          <h3>{launch.name}</h3>
        </div>
        <span className={`status-pill ${launch.success === false ? 'status-pill--delayed' : ''}`}>
          {launch.success === false ? 'Investigating' : 'On schedule'}
        </span>
      </div>

      <p className="launch-card__details">{launch.details}</p>
      <dl className="launch-card__meta">
        <div>
          <dt>Window</dt>
          <dd>{formattedDate}</dd>
        </div>
        <div>
          <dt>Article</dt>
          <dd>
            {launch.links.article ? (
              <a href={launch.links.article} target="_blank" rel="noreferrer">
                Briefing -&gt;
              </a>
            ) : (
              'TBD'
            )}
          </dd>
        </div>
      </dl>

      <div className="launch-card__actions">
        <button type="button" className="button" onClick={() => onPinToggle(launch.id)}>
          {isPinned ? 'Unpin from board' : 'Pin to board'}
        </button>
        <button type="button" className="button button--ghost" onClick={() => onSelect?.(launch.id)}>
          Focus
        </button>
      </div>
    </article>
  )
}

export default LaunchCard

import type { Launch } from '../types/launch'

const UPCOMING_LAUNCHES_URL = 'https://api.spacexdata.com/v5/launches/upcoming'

interface LaunchApiResponse {
  id: string
  name: string
  date_utc: string
  details: string | null
  success: boolean | null
  links?: {
    patch?: { small: string | null } | null
    article?: string | null
    webcast?: string | null
  }
}

export async function fetchUpcomingLaunches(signal?: AbortSignal): Promise<Launch[]> {
  const response = await fetch(UPCOMING_LAUNCHES_URL, { signal })

  if (!response.ok) {
    throw new Error('Unable to reach SpaceX telemetry')
  }

  const data: LaunchApiResponse[] = await response.json()

  return data
    .map((launch) => ({
      id: launch.id,
      name: launch.name,
      date_utc: launch.date_utc,
      details: launch.details ?? 'Mission brief pending final review.',
      success: launch.success,
      links: {
        patch: {
          small: launch.links?.patch?.small ?? null,
        },
        article: launch.links?.article ?? null,
        webcast: launch.links?.webcast ?? null,
      },
    }))
    .sort(
      (a, b) =>
        new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime(),
    )
    .slice(0, 6)
}

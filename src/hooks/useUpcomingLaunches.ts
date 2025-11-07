import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchUpcomingLaunches } from '../services/launchService'
import type { Launch } from '../types/launch'

type Status = 'idle' | 'loading' | 'success' | 'error'

const STALE_TIME = 1000 * 60 * 5 // 5 minutes cache window

interface UseUpcomingLaunchesResult {
  launches: Launch[]
  status: Status
  error: string | null
  refresh: (opts?: { silent?: boolean }) => Promise<void>
  nextLaunch: Launch | undefined
}

export function useUpcomingLaunches(): UseUpcomingLaunchesResult {
  const [launches, setLaunches] = useState<Launch[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const cacheRef = useRef<{ timestamp: number; data: Launch[] } | null>(null)

  const refresh = useCallback(async ({ silent }: { silent?: boolean } = {}) => {
    if (!silent) {
      setStatus('loading')
    }

    try {
      if (
        cacheRef.current &&
        Date.now() - cacheRef.current.timestamp < STALE_TIME &&
        silent
      ) {
        setLaunches(cacheRef.current.data)
        setStatus('success')
        return
      }

      const controller = new AbortController()
      const data = await fetchUpcomingLaunches(controller.signal)
      cacheRef.current = { data, timestamp: Date.now() }
      setLaunches(data)
      setStatus('success')
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load missions'
      setError(message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    refresh({ silent: true })
  }, [refresh])

  const nextLaunch = useMemo(() => launches.at(0), [launches])

  return { launches, status, error, refresh, nextLaunch }
}

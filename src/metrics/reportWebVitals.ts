import { Metric, onCLS, onINP, onLCP } from 'web-vitals'

type Reporter = (metric: Metric) => void

export function reportWebVitals(onReport: Reporter) {
  onCLS(onReport)
  onINP(onReport)
  onLCP(onReport)
}

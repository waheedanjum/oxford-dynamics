import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { reportWebVitals } from './metrics/reportWebVitals'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

reportWebVitals((metric) => {
  if (import.meta.env.DEV) {
    console.info('[web-vitals]', metric.name, Math.round(metric.value))
  }
})

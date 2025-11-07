import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import './App.css'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Missions = lazy(() => import('./pages/Missions'))
const Analytics = lazy(() => import('./pages/Analytics'))

function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="page-loader">Preparing mission data...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App

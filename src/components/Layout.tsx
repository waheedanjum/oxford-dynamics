import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Missions', path: '/missions' },
  { label: 'Analytics', path: '/analytics' },
]

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Oxford Dynamics</p>
          <h1>Mission Control</h1>
        </div>
        <nav className="main-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link--active' : 'nav-link'
              }
              end={item.path === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="app-main" role="main">
        {children}
      </main>

      <footer className="app-footer" />
    </div>
  )
}

export default Layout

import { Link, Outlet, useLocation } from 'react-router'
import './Layout.css'

function Layout() {
  const location = useLocation()

  return (
    <div className="layout">
      <nav className="navigation">
        <div className="nav-container">
          <div className="nav-title">🎨 Color Name Finder</div>
          <div className="nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Single Color
            </Link>
            <Link
              to="/multi"
              className={`nav-link ${location.pathname === '/multi' ? 'active' : ''}`}
            >
              Multi-Constraint
            </Link>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

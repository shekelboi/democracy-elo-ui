import { Link } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>Democracy ELO</Link>
        <nav style={styles.nav}>
          <Link to="/stats" className="nav-link" style={styles.navLink}>Statistics</Link>
        </nav>
      </header>
      <main style={styles.main}>
        {children}
      </main>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.25rem',
    backgroundColor: '#1a1a2e',
    color: '#eee',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  logo: {
    fontSize: '1.35rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    whiteSpace: 'nowrap',
  },
  nav: {
    display: 'flex',
    gap: '0.75rem',
  },
  navLink: {
    padding: '0.4rem 0.85rem',
    borderRadius: '6px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    transition: 'background-color 0.2s',
  },
  main: {
    flex: 1,
    padding: '1.5rem 1.25rem 2rem',
  },
}

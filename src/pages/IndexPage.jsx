import { useState, useEffect, useCallback } from 'react'
import { fetchRandomPair, selectWinner } from '../api'
import { getFlagPath } from '../utils'

export default function IndexPage() {
  const [pair, setPair] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  const loadPair = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRandomPair()
      setPair(data)
    } catch (err) {
      setError(err.message || 'Failed to load countries')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPair()
  }, [loadPair])

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 768)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleVote = async (winnerCountry) => {
    if (!pair || pair.length !== 2 || submitting) return
    setSubmitting(true)
    const country1 = pair[0]
    const country2 = pair[1]
    const winnerIsCountry1 = winnerCountry.id === country1.id
    try {
      await selectWinner(country1.id, country2.id, winnerIsCountry1)
      loadPair()
    } catch (err) {
      setError(err.message || 'Failed to submit vote')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSkip = () => {
    if (!submitting) loadPair()
  }

  if (loading && !pair) {
    return (
      <div style={styles.center}>
        <p style={styles.loading}>Loading...</p>
      </div>
    )
  }

  if (error && !pair) {
    return (
      <div style={styles.center}>
        <p style={styles.error}>{error}</p>
        <button onClick={loadPair} style={styles.retry}>Retry</button>
      </div>
    )
  }

  if (!pair || pair.length !== 2) {
    return (
      <div style={styles.center}>
        <p style={styles.error}>No countries available for comparison.</p>
      </div>
    )
  }

  const [country1, country2] = pair

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Which country is more democratic?</h1>
      <div
        style={{
          ...styles.flagsRow,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <FlagCard
          country={country1}
          isHovered={hovered === country1.id}
          onHover={() => setHovered(country1.id)}
          onLeave={() => setHovered(null)}
          onClick={() => handleVote(country1)}
          disabled={submitting}
        />
        <span
          style={{
            ...styles.vs,
            fontSize: isMobile ? '1.7rem' : '1.5rem',
            margin: isMobile ? '0.75rem 0' : '0 1rem',
          }}
        >
          vs
        </span>
        <FlagCard
          country={country2}
          isHovered={hovered === country2.id}
          onHover={() => setHovered(country2.id)}
          onLeave={() => setHovered(null)}
          onClick={() => handleVote(country2)}
          disabled={submitting}
        />
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <button
        style={styles.skip}
        onClick={handleSkip}
        disabled={submitting}
      >
        Skip
      </button>
    </div>
  )
}

function FlagCard({ country, isHovered, onHover, onLeave, onClick, disabled }) {
  const scale = isHovered ? 1.08 : 1
  return (
    <div
      style={{
        ...styles.flagCard,
        transform: `scale(${scale})`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={() => !disabled && onClick()}
    >
      <img
        src={getFlagPath(country.id)}
        alt={country.name}
        style={styles.flagImg}
        onError={(e) => {
          e.target.src = '/flags/xx.svg'
          e.target.onerror = null
        }}
      />
      <p style={styles.countryName}>{country.name}</p>
    </div>
  )
}

const styles = {
  wrapper: {
    maxWidth: 900,
    margin: '0 auto',
    textAlign: 'center',
    position: 'relative',
    minHeight: 400,
    paddingBottom: '3rem',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    gap: '1rem',
  },
  title: {
    fontSize: '1.6rem',
    marginBottom: '1.75rem',
    color: '#1a1a2e',
    fontWeight: 600,
    padding: '0 0.5rem',
  },
  flagsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
    marginBottom: '2rem',
  },
  flagCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.25rem',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  flagImg: {
    width: '38vw',
    maxWidth: 260,
    minWidth: 140,
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '0.75rem',
  },
  countryName: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#333',
  },
  vs: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#444',
    alignSelf: 'center',
  },
  skip: {
    position: 'fixed',
    right: '1rem',
    bottom: '1rem',
    padding: '0.55rem 1.1rem',
    backgroundColor: 'transparent',
    border: '1px solid #ccc',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#666',
  },
  loading: {
    color: '#666',
    fontSize: '1.1rem',
  },
  error: {
    color: '#c0392b',
    marginBottom: '1rem',
  },
  retry: {
    padding: '0.5rem 1rem',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
}

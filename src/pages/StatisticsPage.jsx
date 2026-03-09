import { useState, useEffect, useMemo } from 'react'
import { fetchCountries } from '../api'
import { getFlagPath } from '../utils'

export default function StatisticsPage() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('elo')
  const [sortDir, setSortDir] = useState('desc')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await fetchCountries()
        if (!cancelled) setCountries(data)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load countries')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const filteredAndSorted = useMemo(() => {
    let list = countries
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q))
    }
    list = [...list].sort((a, b) => {
      let va = a[sortKey]
      let vb = b[sortKey]
      if (typeof va === 'string') {
        va = va.toLowerCase()
        vb = (vb || '').toLowerCase()
        return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
      }
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return list
  }, [countries, search, sortKey, sortDir])

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'name' ? 'asc' : 'desc')
    }
  }

  if (loading) {
    return (
      <div style={styles.center}>
        <p style={styles.loading}>Loading statistics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.center}>
        <p style={styles.error}>{error}</p>
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>Country Rankings</h1>
      <input
        type="search"
        placeholder="Search by country name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th} onClick={() => toggleSort('flag')}>
                Flag
              </th>
              <th style={styles.th} onClick={() => toggleSort('name')}>
                Name {sortKey === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th style={styles.th} onClick={() => toggleSort('elo')}>
                ELO {sortKey === 'elo' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((c) => (
              <tr key={c.id} style={styles.tr}>
                <td style={styles.td}>
                  <img
                    src={getFlagPath(c.id)}
                    alt=""
                    style={styles.flagImg}
                    onError={(e) => {
                      e.target.src = '/flags/xx.svg'
                      e.target.onerror = null
                    }}
                  />
                </td>
                <td style={styles.td}>{c.name}</td>
                <td style={styles.td}>{typeof c.elo === 'number' ? c.elo.toFixed(1) : c.elo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    maxWidth: 900,
    margin: '0 auto',
    paddingBottom: '1rem',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  title: {
    fontSize: '1.6rem',
    marginBottom: '1rem',
    color: '#1a1a2e',
    fontWeight: 600,
  },
  search: {
    width: '100%',
    padding: '0.7rem 0.9rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  tableWrap: {
    overflowX: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    backgroundColor: '#fff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    userSelect: 'none',
  },
  tr: {
    borderBottom: '1px solid #eee',
  },
  td: {
    padding: '0.75rem 1rem',
  },
  flagImg: {
    width: 40,
    height: 30,
    objectFit: 'cover',
    borderRadius: '4px',
  },
  loading: {
    color: '#666',
    fontSize: '1.1rem',
  },
  error: {
    color: '#c0392b',
  },
}

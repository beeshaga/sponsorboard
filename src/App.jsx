import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import sponsors, { INDUSTRIES, REGIONS } from './data/sponsors'
import Header from './components/Header'
import InfoBanner from './components/InfoBanner'
import StatBar from './components/StatBar'
import CompanyRow from './components/CompanyRow'
import CompanyCard from './components/CompanyCard'

export default function App() {
  const [search, setSearch] = useState('')
  const [industry, setIndustry] = useState('all')
  const [region, setRegion] = useState('all')
  const [bookmarks, setBookmarks] = useState({})
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [viewMode, setViewMode] = useState('list')
  const [sortBy, setSortBy] = useState('name')
  const [visibleCount, setVisibleCount] = useState(50)
  const searchRef = useRef(null)
  const loaderRef = useRef(null)

  // Filter & sort
  const filtered = useMemo(() => {
    return sponsors.filter(c => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.sub.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      const matchIndustry = industry === 'all' || c.industry === industry
      const matchRegion = region === 'all' || c.region === region
      const matchBookmark = !showBookmarksOnly || bookmarks[c.name]
      return matchSearch && matchIndustry && matchRegion && matchBookmark
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'industry') return a.industry.localeCompare(b.industry)
      if (sortBy === 'region') return a.region.localeCompare(b.region)
      if (sortBy === 'city') return a.city.localeCompare(b.city)
      return 0
    })
  }, [search, industry, region, showBookmarksOnly, bookmarks, sortBy])

  // Reset pagination on filter change
  useEffect(() => { setVisibleCount(50) }, [search, industry, region, showBookmarksOnly, sortBy])

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleCount < filtered.length) {
        setVisibleCount(prev => Math.min(prev + 30, filtered.length))
      }
    }, { threshold: 0.1 })
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [visibleCount, filtered.length])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === 'Escape') {
        searchRef.current?.blur()
        setSearch('')
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const toggleBookmark = useCallback((name) => {
    setBookmarks(prev => ({ ...prev, [name]: !prev[name] }))
  }, [])

  const clearAll = () => {
    setSearch(''); setIndustry('all'); setRegion('all')
    setShowBookmarksOnly(false)
  }

  const hasActiveFilters = search || industry !== 'all' || region !== 'all' || showBookmarksOnly
  const bookmarkCount = Object.values(bookmarks).filter(Boolean).length
  const visible = filtered.slice(0, visibleCount)

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Header />

      <main style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Hero */}
        <div style={{ marginBottom: 36, animation: 'slideUp 0.5s ease-out' }}>
          <p style={{
            fontSize: 12, fontWeight: 600, color: 'var(--green-600)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10,
          }}>
            UK Skilled Worker Visa
          </p>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700,
            lineHeight: 1.15, color: 'var(--gray-900)',
            fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: 12,
          }}>
            Companies licensed to<br />sponsor your visa
          </h1>
          <p style={{
            fontSize: 15, color: 'var(--gray-500)',
            lineHeight: 1.65, maxWidth: 560,
          }}>
            {sponsors.length}+ employers across {REGIONS.length} UK regions, curated for product
            management, content design, business analysis, and professional roles.
            Every company here holds a valid Skilled Worker sponsor licence.
          </p>
        </div>

        {showInfo && <InfoBanner onDismiss={() => setShowInfo(false)} />}
        <StatBar total={sponsors.length} filtered={filtered.length} />

        {/* Search */}
        <div style={{ marginBottom: 16, animation: 'slideUp 0.5s ease-out 0.15s both' }}>
          <div style={{ position: 'relative' }}>
            <svg style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--gray-400)',
            }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by company, city, region, or industry..."
              style={{
                width: '100%', padding: '13px 60px 13px 44px',
                background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
                borderRadius: 10, color: 'var(--gray-900)', fontSize: 14,
                fontFamily: 'var(--font-body)', outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--green-500)'
                e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.1)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--gray-200)'
                e.target.style.boxShadow = 'none'
              }}
            />
            <kbd style={{
              position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
              fontSize: 11, color: 'var(--gray-400)',
              fontFamily: 'var(--font-mono)',
              border: '1px solid var(--gray-200)', padding: '1px 6px',
              borderRadius: 4, background: 'white',
            }}>
              /
            </kbd>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-row" style={{
          display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center',
          marginBottom: 20, animation: 'slideUp 0.5s ease-out 0.2s both',
        }}>
          <div className="sel-wrap">
            <select value={industry} onChange={e => setIndustry(e.target.value)}>
              <option value="all">All Industries</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="sel-wrap">
            <select value={region} onChange={e => setRegion(e.target.value)}>
              <option value="all">All Regions</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="sel-wrap">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="name">Sort: Name</option>
              <option value="industry">Sort: Industry</option>
              <option value="region">Sort: Region</option>
              <option value="city">Sort: City</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className={`chip ${showBookmarksOnly ? 'active' : ''}`}
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            >
              ★ Saved {bookmarkCount > 0 && `(${bookmarkCount})`}
            </button>
            {hasActiveFilters && (
              <button className="chip" onClick={clearAll} style={{ color: '#ef4444', borderColor: '#fecaca' }}>
                Clear all
              </button>
            )}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              style={{
                background: viewMode === 'list' ? 'var(--gray-100)' : 'white',
                border: '1px solid var(--gray-200)', borderRadius: 6,
                padding: '6px 8px', cursor: 'pointer', color: 'var(--gray-500)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              style={{
                background: viewMode === 'grid' ? 'var(--gray-100)' : 'white',
                border: '1px solid var(--gray-200)', borderRadius: 6,
                padding: '6px 8px', cursor: 'pointer', color: 'var(--gray-500)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Result count */}
        <div style={{
          fontSize: 12, color: 'var(--gray-400)',
          fontFamily: 'var(--font-mono)', marginBottom: 12, paddingLeft: 4,
        }}>
          {filtered.length} of {sponsors.length} sponsors
          {search && <> matching "{search}"</>}
        </div>

        {/* List view */}
        {viewMode === 'list' && (
          <div style={{
            border: '1px solid var(--gray-100)', borderRadius: 12,
            overflow: 'hidden', background: 'white',
          }}>
            <div className="list-header" style={{
              display: 'grid', gridTemplateColumns: '1fr auto auto auto',
              gap: 12, padding: '10px 20px',
              background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-100)',
              fontSize: 11, fontWeight: 600, color: 'var(--gray-400)',
              fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              <span>Company</span>
              <span className="hide-mobile">Type</span>
              <span>Industry</span>
              <span>Link</span>
            </div>
            {visible.map((c, i) => (
              <CompanyRow
                key={c.name + c.city}
                company={c}
                index={i}
                isBookmarked={!!bookmarks[c.name]}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}

        {/* Grid view */}
        {viewMode === 'grid' && (
          <div className="desktop-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 12,
          }}>
            {visible.map((c, i) => (
              <CompanyCard
                key={c.name + c.city}
                company={c}
                index={i}
                isBookmarked={!!bookmarks[c.name]}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}

        {/* Infinite scroll trigger */}
        {visibleCount < filtered.length && (
          <div ref={loaderRef} style={{
            textAlign: 'center', padding: '30px 0',
            fontSize: 12, color: 'var(--gray-400)', fontFamily: 'var(--font-mono)',
          }}>
            Loading more...
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>∅</div>
            <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 16 }}>
              No sponsors match those filters
            </p>
            <button onClick={clearAll} className="chip">Reset all filters</button>
          </div>
        )}

        {/* Update info */}
        <div style={{
          marginTop: 48, padding: 28,
          background: 'var(--gray-50)', borderRadius: 14, border: '1px solid var(--gray-100)',
        }}>
          <h3 style={{
            fontSize: 16, fontWeight: 600,
            fontFamily: 'var(--font-display)', color: 'var(--gray-900)', marginBottom: 12,
          }}>
            Keeping this data current
          </h3>
          <div style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.8, fontFamily: 'var(--font-body)' }}>
            <p style={{ marginBottom: 10 }}>
              The Home Office publishes the full register as a downloadable CSV, updated roughly every week:
            </p>
            <a
              href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--green-600)', fontWeight: 500, fontFamily: 'var(--font-mono)', fontSize: 12 }}
            >
              gov.uk/government/publications/register-of-licensed-sponsors-workers ↗
            </a>
            <p style={{ marginTop: 14, marginBottom: 8 }}>
              <strong>To automate updates</strong>, add a Vercel cron job or GitHub Action that:
            </p>
            <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Fetches the CSV from gov.uk on a weekly schedule</li>
              <li>Parses and filters for A-rated Skilled Worker sponsors</li>
              <li>Matches companies to careers page URLs via a lookup table</li>
              <li>Commits the updated data file back to the repo (triggering a Vercel redeploy)</li>
            </ol>
            <p style={{
              marginTop: 14, padding: '12px 16px',
              background: 'var(--green-50)', borderRadius: 8, border: '1px solid var(--green-100)',
              fontSize: 12,
            }}>
              <strong>Quick manual update:</strong> Edit <code style={{ fontFamily: 'var(--font-mono)', background: '#e5e7eb', padding: '1px 4px', borderRadius: 3 }}>src/data/sponsors.js</code> and push to GitHub — Vercel will auto-deploy.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          textAlign: 'center', padding: '40px 0 20px',
          marginTop: 40, borderTop: '1px solid var(--gray-100)',
        }}>
          <p style={{
            fontSize: 12, color: 'var(--gray-400)',
            fontFamily: 'var(--font-mono)', lineHeight: 1.8,
          }}>
            Data sourced from the UK Home Office Register of Licensed Sponsors<br />
            Always verify sponsorship status directly with employers before applying<br />
            Last curated: March 2026
          </p>
        </footer>
      </main>
    </div>
  )
}

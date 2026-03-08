import { useState } from 'react'

export default function CompanyRow({ company, index, isBookmarked, onToggleBookmark }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="list-row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto',
        alignItems: 'center',
        gap: 12,
        padding: '14px 20px',
        background: hovered ? '#f8fafb' : 'white',
        borderBottom: '1px solid var(--gray-100)',
        transition: 'all 0.15s ease',
        animation: `slideUp 0.3s ease-out ${Math.min(index * 0.015, 0.5)}s both`,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 14, fontWeight: 550, color: 'var(--gray-900)',
            fontFamily: 'var(--font-body)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {company.name}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onToggleBookmark(company.name) }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: isBookmarked ? '#f59e0b' : '#e5e7eb',
              fontSize: 14, padding: 0, flexShrink: 0,
              transition: 'color 0.15s',
            }}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarked ? '★' : '☆'}
          </button>
        </div>
        <div style={{
          fontSize: 12, color: 'var(--gray-400)',
          fontFamily: 'var(--font-mono)', marginTop: 2,
        }}>
          {company.city} · {company.region}
        </div>
      </div>

      <span className="hide-mobile" style={{
        fontSize: 11, fontWeight: 500, color: 'var(--gray-500)',
        background: 'var(--gray-100)', padding: '3px 10px', borderRadius: 20,
        fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
      }}>
        {company.sub}
      </span>

      <span style={{
        fontSize: 11, fontWeight: 600, color: 'var(--green-700)',
        background: 'var(--green-50)', padding: '3px 10px', borderRadius: 20,
        fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap',
      }}>
        {company.industry}
      </span>

      <a
        href={company.careersUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 12, fontWeight: 500,
          color: hovered ? 'var(--green-600)' : 'var(--gray-400)',
          textDecoration: 'none', transition: 'color 0.15s',
          fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
        }}
      >
        Careers
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    </div>
  )
}

export default function CompanyCard({ company, index, isBookmarked, onToggleBookmark }) {
  return (
    <div
      className="grid-card"
      style={{ animation: `slideUp 0.3s ease-out ${Math.min(index * 0.02, 0.4)}s both` }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
        <div>
          <h3 style={{
            fontSize: 14, fontWeight: 600, color: 'var(--gray-900)',
            fontFamily: 'var(--font-body)', marginBottom: 4,
          }}>
            {company.name}
          </h3>
          <p style={{
            fontSize: 12, color: 'var(--gray-400)',
            fontFamily: 'var(--font-mono)',
          }}>
            {company.city} · {company.region}
          </p>
        </div>
        <button
          onClick={() => onToggleBookmark(company.name)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: isBookmarked ? '#f59e0b' : 'var(--gray-200)', fontSize: 16,
          }}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {isBookmarked ? '★' : '☆'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 11, background: 'var(--green-50)', color: 'var(--green-700)',
          padding: '2px 8px', borderRadius: 12,
          fontFamily: 'var(--font-mono)', fontWeight: 500,
        }}>
          {company.industry}
        </span>
        <span style={{
          fontSize: 11, background: 'var(--gray-50)', color: 'var(--gray-500)',
          padding: '2px 8px', borderRadius: 12,
          fontFamily: 'var(--font-mono)',
        }}>
          {company.sub}
        </span>
      </div>

      <a
        href={company.careersUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: 12, fontWeight: 500, color: 'var(--green-600)',
          textDecoration: 'none', fontFamily: 'var(--font-body)',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}
      >
        View careers page
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    </div>
  )
}

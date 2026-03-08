export default function InfoBanner({ onDismiss }) {
  return (
    <div style={{
      background: 'var(--green-50)', border: '1px solid #c6f0d5', borderRadius: 12,
      padding: '20px 24px', marginBottom: 28, position: 'relative',
      animation: 'slideDown 0.4s ease-out',
    }}>
      <button
        onClick={onDismiss}
        style={{
          position: 'absolute', top: 12, right: 14,
          background: 'none', border: 'none',
          color: 'var(--gray-500)', cursor: 'pointer', fontSize: 18, lineHeight: 1,
        }}
        aria-label="Dismiss"
      >
        ×
      </button>

      <h3 style={{
        margin: '0 0 8px', fontSize: 14, fontWeight: 600,
        color: 'var(--green-800)', fontFamily: 'var(--font-body)',
      }}>
        How this works
      </h3>

      <p style={{
        margin: 0, fontSize: 13, color: 'var(--gray-700)',
        lineHeight: 1.7, fontFamily: 'var(--font-body)',
      }}>
        Every company listed here is on the UK Home Office's{' '}
        <strong>Register of Licensed Sponsors</strong> — meaning they're approved
        to sponsor Skilled Worker visas. The register is updated weekly by the
        government. Click any company to go directly to their careers page.
      </p>

      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        <a
          href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12, color: 'var(--green-800)', textDecoration: 'none',
            background: 'var(--green-100)', padding: '5px 12px', borderRadius: 6,
            fontFamily: 'var(--font-mono)', fontWeight: 500,
          }}
        >
          Full Home Office list ↗
        </a>
        <a
          href="https://www.gov.uk/skilled-worker-visa"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12, color: 'var(--green-800)', textDecoration: 'none',
            background: 'var(--green-100)', padding: '5px 12px', borderRadius: 6,
            fontFamily: 'var(--font-mono)', fontWeight: 500,
          }}
        >
          Skilled Worker visa guide ↗
        </a>
      </div>
    </div>
  )
}

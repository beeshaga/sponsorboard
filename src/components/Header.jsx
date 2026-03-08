export default function Header() {
  return (
    <header style={{
      borderBottom: '1px solid var(--gray-100)',
      background: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1120, margin: '0 auto', padding: '14px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #059669, #10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 14, fontWeight: 700,
            fontFamily: 'var(--font-display)',
          }}>
            S
          </div>
          <span style={{
            fontSize: 15, fontWeight: 600,
            fontFamily: 'var(--font-body)',
            color: 'var(--gray-900)',
          }}>
            SponsorBoard
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600,
            background: 'var(--green-50)', color: 'var(--green-700)',
            padding: '2px 8px', borderRadius: 10,
            fontFamily: 'var(--font-mono)', letterSpacing: '0.03em',
          }}>
            UK
          </span>
        </div>

        <a
          href="https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12, color: 'var(--gray-500)', textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
            padding: '6px 12px', borderRadius: 6,
            border: '1px solid var(--gray-200)',
            transition: 'all 0.15s',
          }}
        >
          gov.uk source ↗
        </a>
      </div>
    </header>
  )
}

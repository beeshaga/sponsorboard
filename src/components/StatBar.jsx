import { INDUSTRIES, REGIONS } from '../data/sponsors'

export default function StatBar({ total, filtered }) {
  const stats = [
    { label: 'Total Sponsors', value: total, color: '#059669' },
    { label: 'Industries', value: INDUSTRIES.length, color: '#7c3aed' },
    { label: 'UK Regions', value: REGIONS.length, color: '#2563eb' },
    { label: 'Showing', value: filtered, color: '#d97706' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
      gap: 10,
      marginBottom: 28,
    }}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          style={{
            background: 'var(--gray-50)',
            border: '1px solid #f0f0f0',
            borderRadius: 10,
            padding: '14px 16px',
            animation: `slideUp 0.4s ease-out ${i * 0.05}s both`,
          }}
        >
          <div style={{
            fontSize: 24, fontWeight: 700, color: stat.color,
            fontFamily: 'var(--font-display)', letterSpacing: '-0.02em',
          }}>
            {stat.value}
          </div>
          <div style={{
            fontSize: 11, color: 'var(--gray-400)',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2,
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

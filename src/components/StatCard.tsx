import { ReactNode } from 'react'

interface StatCardProps {
  icon?: string
  iconBg?: string
  iconColor?: string
  label: string
  value: string
  footer?: ReactNode
  badge?: string
  badgeBg?: string
  badgeText?: string
  /** Optional series identifier shown as eyebrow (e.g. "01 / KPI") */
  series?: string
  /** Tone — controls the numeral & accent color */
  tone?: 'ink' | 'clay' | 'moss' | 'ochre' | 'brick'
}

const toneNumeral: Record<string, string> = {
  ink: 'text-ink-900',
  clay: 'text-clay-500',
  moss: 'text-moss-500',
  ochre: 'text-ochre-500',
  brick: 'text-brick-500',
}

export default function StatCard({
  label, value, footer, badge, series, tone = 'ink',
}: StatCardProps) {
  return (
    <div className="card p-lg group hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between mb-md">
        <span className="eyebrow">{series ?? label}</span>
        {badge && <span className="chip chip-clay">{badge}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className={`numeral text-[64px] ${toneNumeral[tone]}`}>{value}</h3>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-body-sm text-ink-500">{series ? label : ''}</p>
        {footer && <div className="flex items-center gap-xs text-body-sm text-ink-700">{footer}</div>}
      </div>
    </div>
  )
}

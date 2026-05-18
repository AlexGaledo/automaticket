import { ReactNode } from 'react'

interface StatCardProps {
  icon: string
  iconBg: string
  iconColor: string
  label: string
  value: string
  footer?: ReactNode
  badge?: string
  badgeBg?: string
  badgeText?: string
}

export default function StatCard({ icon, iconBg, iconColor, label, value, footer, badge, badgeBg, badgeText }: StatCardProps) {
  return (
    <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
      <div className="flex justify-between items-start mb-sm">
        <span className={`material-symbols-outlined ${iconColor} ${iconBg} p-sm rounded-lg`}>{icon}</span>
        {badge && (
          <span className={`text-label-sm font-label-sm ${badgeText} ${badgeBg} px-xs py-[2px] rounded`}>{badge}</span>
        )}
      </div>
      <p className="font-body-sm text-body-sm text-secondary">{label}</p>
      <h3 className="font-headline-md text-headline-md font-bold text-on-surface">{value}</h3>
      {footer && <div className="mt-sm flex items-center gap-xs font-label-sm">{footer}</div>}
    </div>
  )
}

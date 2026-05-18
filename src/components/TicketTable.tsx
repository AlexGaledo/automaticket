import { Ticket } from '../types'

interface TicketTableProps {
  tickets: Ticket[]
  variant: 'admin' | 'client'
  onResolve?: (id: string) => void
  resolvingId?: string | null
  compact?: boolean
}

const priorityColors: Record<string, string> = {
  High: 'bg-error-container text-on-error-container',
  Med: 'bg-tertiary-fixed text-on-tertiary-fixed',
  Low: 'bg-secondary-container text-on-secondary-container',
  Urgent: 'bg-error-container text-on-error-container',
  Normal: 'bg-surface-container text-on-surface',
}

const statusStyles: Record<string, string> = {
  Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Escalated: 'bg-orange-50 text-orange-700 border-orange-200',
}

const priorityDot: Record<string, string> = {
  High: 'bg-error',
  Med: 'bg-tertiary',
  Low: 'bg-secondary',
  Urgent: 'bg-error',
  Normal: 'bg-primary',
}

export default function TicketTable({ tickets, variant, onResolve, resolvingId, compact }: TicketTableProps) {
  if (variant === 'admin') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="px-lg py-md font-label-md text-label-md text-secondary uppercase tracking-wider">Client & Ticket ID</th>
              <th className="px-lg py-md font-label-md text-label-md text-secondary uppercase tracking-wider">Issue Description</th>
              <th className="px-lg py-md font-label-md text-label-md text-secondary uppercase tracking-wider">Priority</th>
              <th className="px-lg py-md font-label-md text-label-md text-secondary uppercase tracking-wider">Time Escalated</th>
              <th className="px-lg py-md font-label-md text-label-md text-secondary uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                <td className={`px-lg py-md ${t.borderColor} border-l-4`}>
                  <div className="flex items-center gap-md">
                    <div className="h-10 w-10 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-body-md text-body-md font-bold text-on-surface">{t.clientName}</p>
                      <p className="font-label-sm text-label-sm text-secondary">{t.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-lg py-md max-w-xs">
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{t.subject}</p>
                </td>
                <td className="px-lg py-md">
                  <span className={`px-sm py-xs ${priorityColors[t.priority] || priorityColors.Normal} font-label-sm text-label-sm rounded-lg`}>
                    {t.priority}
                  </span>
                </td>
                <td className="px-lg py-md font-body-sm text-body-sm text-secondary">{t.timeAgo}</td>
                <td className="px-lg py-md text-right">
                  <div className="flex justify-end gap-sm items-center">
                    {t.status === 'Resolved' ? (
                      <span className={`px-sm py-[2px] border rounded font-label-sm ${statusStyles.Resolved}`}>Resolved</span>
                    ) : (
                      <>
                        <button className="px-md py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90">Reply</button>
                        <button
                          onClick={() => onResolve?.(t.id)}
                          disabled={resolvingId === t.id}
                          className="px-md py-sm border border-outline text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high disabled:opacity-50"
                        >
                          {resolvingId === t.id ? 'Resolving...' : 'Resolve'}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant">
            <th className={`font-label-md text-secondary uppercase tracking-wider ${compact ? 'px-md py-sm' : 'px-lg py-md'}`}>TICKET ID</th>
            <th className={`font-label-md text-secondary uppercase tracking-wider ${compact ? 'px-md py-sm' : 'px-lg py-md'}`}>SUBJECT</th>
            <th className={`font-label-md text-secondary uppercase tracking-wider ${compact ? 'px-md py-sm' : 'px-lg py-md'}`}>STATUS</th>
            <th className={`font-label-md text-secondary uppercase tracking-wider ${compact ? 'px-md py-sm' : 'px-lg py-md'}`}>PRIORITY</th>
            {!compact && (
              <th className={`font-label-md text-secondary uppercase tracking-wider text-right ${compact ? 'px-md py-sm' : 'px-lg py-md'}`}>ACTION</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {tickets.map((t) => (
            <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
              <td className={`font-label-sm text-primary ${compact ? 'px-md py-sm' : 'px-lg py-md'}`}>{t.id}</td>
              <td className={`font-body-sm font-medium ${compact ? 'px-md py-sm truncate max-w-[120px]' : 'px-lg py-md'}`}>{t.subject}</td>
              <td className={`${compact ? 'px-md py-sm' : 'px-lg py-md'}`}>
                <span className={`px-sm py-[2px] border rounded font-label-sm text-[11px] ${statusStyles[t.status] || ''}`}>{t.status}</span>
              </td>
              <td className={`${compact ? 'px-md py-sm' : 'px-lg py-md'}`}>
                <div className="flex items-center gap-sm">
                  <div className={`w-1 h-4 rounded-full ${priorityDot[t.priority] || priorityDot.Normal}`} />
                  <span className={`${compact ? 'font-label-sm text-[11px]' : 'font-body-sm'}`}>{t.priority}</span>
                </div>
              </td>
              {!compact && (
                <td className="px-lg py-md text-right">
                  <button className="text-primary font-bold text-label-md hover:underline">View Detail</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
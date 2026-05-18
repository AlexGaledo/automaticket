import { Ticket } from '../types'

interface TicketTableProps {
  tickets: Ticket[]
  variant: 'admin' | 'client'
  onResolve?: (id: string) => void
  resolvingId?: string | null
  compact?: boolean
}

const priorityChip: Record<string, string> = {
  High:    'chip-brick',
  Urgent:  'chip-brick',
  Med:     'chip-ochre',
  Low:     'chip-neutral',
  Normal:  'chip-neutral',
}

const statusChip: Record<string, string> = {
  Resolved:      'chip-moss',
  'In Progress': 'chip-clay',
  Escalated:     'chip-brick',
}

const priorityDot: Record<string, string> = {
  High: 'bg-brick-500',
  Urgent: 'bg-brick-500',
  Med: 'bg-ochre-500',
  Low: 'bg-ink-300',
  Normal: 'bg-ink-300',
}

export default function TicketTable({ tickets, variant, onResolve, resolvingId, compact }: TicketTableProps) {
  const cellPad = compact ? 'px-4 py-3' : 'px-6 py-4'

  if (variant === 'admin') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline">
              {['Client', 'Issue', 'Priority', 'Escalated', 'Action'].map((h, i) => (
                <th
                  key={h}
                  className={`${cellPad} eyebrow ${i === 4 ? 'text-right' : ''}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, idx) => (
              <tr
                key={t.id}
                className="border-b border-outline-soft hover:bg-outline-soft/60 transition-colors"
                style={{ animation: `fade-in 0.4s ${idx * 0.03}s both` }}
              >
                <td className={cellPad}>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-outline-soft
                                    flex items-center justify-center font-mono text-mono-xs
                                    text-ink-700 border border-outline">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-body-md text-ink-900 tracking-tight">{t.clientName}</p>
                      <p className="font-mono text-mono-xs text-ink-500">{t.id}</p>
                    </div>
                  </div>
                </td>
                <td className={`${cellPad} max-w-sm`}>
                  <p className="text-body-md text-ink-700 truncate text-pretty">{t.subject}</p>
                </td>
                <td className={cellPad}>
                  <span className={`chip ${priorityChip[t.priority] || 'chip-neutral'}`}>
                    <span className={`status-dot ${priorityDot[t.priority] || 'bg-ink-300'}`} />
                    {t.priority}
                  </span>
                </td>
                <td className={`${cellPad} text-body-sm text-ink-500 tabular`}>{t.timeAgo}</td>
                <td className={`${cellPad} text-right`}>
                  <div className="flex justify-end gap-2 items-center">
                    {t.status === 'Resolved' ? (
                      <span className={`chip ${statusChip.Resolved}`}>
                        <span className="status-dot bg-moss-500" /> Resolved
                      </span>
                    ) : (
                      <>
                        <button className="btn btn-primary text-xs px-3 py-1.5">Reply</button>
                        <button
                          onClick={() => onResolve?.(t.id)}
                          disabled={resolvingId === t.id}
                          className="btn btn-secondary text-xs px-3 py-1.5 disabled:opacity-50"
                        >
                          {resolvingId === t.id ? 'Resolving…' : 'Resolve'}
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
          <tr className="border-b border-outline">
            {(['Ticket', 'Subject', 'Status', 'Priority'] as const).map((h) => (
              <th key={h} className={`${cellPad} eyebrow`}>{h}</th>
            ))}
            {!compact && <th className={`${cellPad} eyebrow text-right`}>Action</th>}
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id} className="border-b border-outline-soft hover:bg-outline-soft/60 transition-colors">
              <td className={`${cellPad} font-mono text-mono-sm text-clay-500`}>{t.id}</td>
              <td className={`${cellPad} text-body-md text-ink-700 ${compact ? 'truncate max-w-[140px]' : ''}`}>{t.subject}</td>
              <td className={cellPad}>
                <span className={`chip ${statusChip[t.status] || 'chip-neutral'}`}>
                  <span className={`status-dot ${
                    t.status === 'Resolved' ? 'bg-moss-500'
                    : t.status === 'Escalated' ? 'bg-brick-500'
                    : 'bg-clay-500'
                  }`} />
                  {t.status}
                </span>
              </td>
              <td className={cellPad}>
                <div className="flex items-center gap-2">
                  <span className={`status-dot ${priorityDot[t.priority] || 'bg-ink-300'}`} />
                  <span className="text-body-sm text-ink-700">{t.priority}</span>
                </div>
              </td>
              {!compact && (
                <td className={`${cellPad} text-right`}>
                  <button className="font-mono text-mono-xs uppercase tracking-widest text-clay-500 hover:text-clay-700">
                    View →
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

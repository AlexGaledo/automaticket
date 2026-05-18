import { Ticket } from '../types'

interface TicketTableProps {
  tickets: Ticket[]
  variant: 'admin' | 'client'
  onResolve?: (id: string) => void
  resolvingId?: string | null
  compact?: boolean
}

const priorityColors: Record<string, string> = {
  High: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300',
  Med: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300',
  Low: 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  Urgent: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300',
  Normal: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
}

const statusStyles: Record<string, string> = {
  Resolved: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'In Progress': 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Escalated: 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
}

const priorityDot: Record<string, string> = {
  High: 'bg-red-500',
  Med: 'bg-amber-500',
  Low: 'bg-slate-400',
  Urgent: 'bg-red-500',
  Normal: 'bg-indigo-500',
}

export default function TicketTable({ tickets, variant, onResolve, resolvingId, compact }: TicketTableProps) {
  if (variant === 'admin') {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <th className="px-lg py-md text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Client & Ticket ID</th>
              <th className="px-lg py-md text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Issue Description</th>
              <th className="px-lg py-md text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Priority</th>
              <th className="px-lg py-md text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Time Escalated</th>
              <th className="px-lg py-md text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <td className={`px-lg py-md ${t.borderColor}`}>
                  <div className="flex items-center gap-md">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.clientName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-lg py-md max-w-xs">
                  <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{t.subject}</p>
                </td>
                <td className="px-lg py-md">
                  <span className={`px-2 py-0.5 ${priorityColors[t.priority] || priorityColors.Normal} text-xs font-semibold rounded`}>
                    {t.priority}
                  </span>
                </td>
                <td className="px-lg py-md text-sm text-slate-500 dark:text-slate-400">{t.timeAgo}</td>
                <td className="px-lg py-md text-right">
                  <div className="flex justify-end gap-sm items-center">
                    {t.status === 'Resolved' ? (
                      <span className={`px-2 py-0.5 border rounded text-xs font-semibold ${statusStyles.Resolved}`}>Resolved</span>
                    ) : (
                      <>
                        <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">Reply</button>
                        <button
                          onClick={() => onResolve?.(t.id)}
                          disabled={resolvingId === t.id}
                          className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
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
          <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
            {(['TICKET ID', 'SUBJECT', 'STATUS', 'PRIORITY'] as const).map((h) => (
              <th key={h} className={`text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold ${compact ? 'px-md py-sm' : 'px-lg py-md'}`}>{h}</th>
            ))}
            {!compact && (
              <th className={`text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold text-right ${compact ? 'px-md py-sm' : 'px-lg py-md'}`}>ACTION</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {tickets.map((t) => (
            <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <td className={`text-sm font-semibold text-indigo-600 dark:text-indigo-400 ${compact ? 'px-md py-sm' : 'px-lg py-md'}`}>{t.id}</td>
              <td className={`text-sm text-slate-700 dark:text-slate-300 ${compact ? 'px-md py-sm truncate max-w-[120px]' : 'px-lg py-md'}`}>{t.subject}</td>
              <td className={`${compact ? 'px-md py-sm' : 'px-lg py-md'}`}>
                <span className={`px-2 py-0.5 border rounded text-xs font-semibold ${statusStyles[t.status] || ''}`}>{t.status}</span>
              </td>
              <td className={`${compact ? 'px-md py-sm' : 'px-lg py-md'}`}>
                <div className="flex items-center gap-sm">
                  <div className={`w-1 h-4 rounded-full ${priorityDot[t.priority] || priorityDot.Normal}`} />
                  <span className={`text-sm text-slate-600 dark:text-slate-300 ${compact ? 'text-xs' : ''}`}>{t.priority}</span>
                </div>
              </td>
              {!compact && (
                <td className="px-lg py-md text-right">
                  <button className="text-indigo-600 dark:text-indigo-400 font-semibold text-xs hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">View Detail</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

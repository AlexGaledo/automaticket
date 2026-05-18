import { BackendTicket } from '../services/api'
import { Ticket } from '../types'

export function toTicket(t: BackendTicket): Ticket {
  const initials = (t.client_name || 'C')
    .split(' ')
    .map((s: string) => s[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  const borderColor =
    t.priority === 'High' || t.priority === 'Urgent'
      ? 'border-l-error'
      : t.priority === 'Med'
      ? 'border-l-tertiary'
      : 'border-l-secondary'
  return {
    id: t.id.startsWith('#') ? t.id : `#${t.id}`,
    clientName: t.client_name,
    initials,
    subject: t.subject,
    status: t.status as Ticket['status'],
    priority: t.priority as Ticket['priority'],
    timeAgo: new Date(t.created_at).toLocaleTimeString(),
    borderColor,
  }
}

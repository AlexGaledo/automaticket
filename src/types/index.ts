export interface Ticket {
  id: string
  clientName: string
  initials: string
  subject: string
  status: 'Resolved' | 'In Progress' | 'Escalated'
  priority: 'High' | 'Med' | 'Low' | 'Urgent' | 'Normal'
  timeAgo: string
  borderColor: string
}

export interface DashboardStats {
  totalTickets: number
  aiResolved: number
  aiRate: string
  awaitingAdmin: number
  avgResolution: string
  escalatedToday: number
  activeTickets: number
  responseTime: string
}

export interface AiQueryResult {
  response: string
  should_escalate: boolean
}

export type UserRole = 'admin' | 'client' | null

export interface BackendTicket {
  id: string
  subject: string
  description: string
  status: string
  priority: string
  client_name: string
  created_at: string
}

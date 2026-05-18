import { useEffect, useState } from 'react'
import TicketTable from '../components/TicketTable'
import { mockAdminTickets } from '../data/mockTickets'
import { listTickets, updateTicketStatus } from '../services/api'
import { toTicket } from '../utils/tickets'
import { Ticket } from '../types'

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [backendTickets, setBackendTickets] = useState<Ticket[]>([])
  const [mockTickets, setMockTickets] = useState<Ticket[]>(mockAdminTickets)
  const [resolvingId, setResolvingId] = useState<string | null>(null)

  async function refreshTickets() {
    try {
      const list = await listTickets()
      setBackendTickets(list.map(toTicket))
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    refreshTickets()
  }, [])

  async function handleResolve(id: string) {
    setResolvingId(id)
    const backendMatch = backendTickets.find((t) => t.id === id)
    if (backendMatch) {
      try {
        const rawId = id.startsWith('#') ? id.slice(1) : id
        await updateTicketStatus(rawId, 'Resolved')
        setBackendTickets((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t)),
        )
      } catch {
        // ignore
      }
    } else {
      setMockTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t)),
      )
    }
    setResolvingId(null)
  }

  const allTickets = [...backendTickets, ...mockTickets]
  const openCount = allTickets.filter((t) => t.status !== 'Resolved').length

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="fixed top-0 right-0 left-0 z-40 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant h-16 flex justify-between items-center px-xl">
        <h1 className="font-headline-md font-bold text-primary">AutoTicket Command Center</h1>
        <button
          onClick={onLogout}
          className="flex items-center gap-sm text-secondary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md">Logout</span>
        </button>
      </header>

      <main className="flex-1 pt-16">
        <div className="max-w-max-width mx-auto p-xl">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-lg border-b border-outline-variant">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Escalated Ticket Queue</h2>
              <p className="font-body-sm text-body-sm text-secondary">Manual intervention required for {openCount} tickets</p>
            </div>
            <TicketTable tickets={allTickets} variant="admin" onResolve={handleResolve} resolvingId={resolvingId} />
          </div>
        </div>
      </main>
    </div>
  )
}
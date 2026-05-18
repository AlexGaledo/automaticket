import { useEffect, useState } from 'react'
import TicketTable from '../components/TicketTable'
import AIAssistant from '../components/AIAssistant'
import { mockClientTickets } from '../data/mockTickets'
import { listTickets } from '../services/api'
import { toTicket } from '../utils/tickets'
import { Ticket } from '../types'

interface ClientDashboardProps {
  onLogout: () => void
}

export default function ClientDashboard({ onLogout }: ClientDashboardProps) {
  const [backendTickets, setBackendTickets] = useState<Ticket[]>([])

  async function refreshTickets() {
    try {
      const list = await listTickets()
      setBackendTickets(list.map(toTicket))
    } catch {
      // silently fail, keep existing tickets
    }
  }

  useEffect(() => {
    refreshTickets()
  }, [])

  const allTickets = [...backendTickets, ...mockClientTickets]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="fixed top-0 right-0 left-0 z-40 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant h-16 flex justify-between items-center px-xl">
        <h1 className="font-headline-md font-bold text-primary">AutoTicket</h1>
        <button
          onClick={onLogout}
          className="flex items-center gap-sm text-secondary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md">Logout</span>
        </button>
      </header>

      <div className="flex flex-1 pt-16 min-h-0">
        <main className="flex-1 p-xl min-w-0">
          <AIAssistant onTicketCreated={refreshTickets} variant="page" />
        </main>

        <aside className="w-[380px] shrink-0 border-l border-outline-variant p-xl overflow-y-auto bg-surface-container-low/20">
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="px-lg py-md border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md text-on-surface">Recent Tickets</h3>
            </div>
            <TicketTable tickets={allTickets} variant="client" compact />
          </section>
        </aside>
      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import SideNavBar from '../components/SideNavBar'
import TopNavBar from '../components/TopNavBar'
import StatCard from '../components/StatCard'
import TicketTable from '../components/TicketTable'
import AIAssistant from '../components/AIAssistant'
import { mockStats, mockClientTickets } from '../data/mockTickets'
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
    <div className="min-h-screen bg-background">
      <SideNavBar role="client" activePage="dashboard" onNavigate={() => {}} onLogout={onLogout} />
      <TopNavBar role="client" />

      <main className="ml-[240px] pt-16 pr-[360px] min-h-screen">
        <div className="p-xl max-w-max-width mx-auto">
          <div className="grid grid-cols-12 gap-lg mb-xl">
            <div className="col-span-8">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Operations Dashboard</h2>
              <p className="text-secondary font-body-md">Real-time oversight of your automated service layer.</p>
            </div>
            <div className="col-span-4 flex justify-end items-center gap-md">
              <div className="bg-surface-container px-md py-sm rounded-xl border border-outline-variant">
                <span className="text-label-md text-secondary block">System Health</span>
                <div className="flex items-center gap-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-on-surface text-body-md">99.9% Uptime</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-md mb-xl">
            <StatCard
              icon="confirmation_number"
              iconBg="bg-primary/10"
              iconColor="text-primary"
              label="Active Tickets"
              value={String(backendTickets.length + mockStats.activeTickets)}
              footer={
                <>
                  <span className="material-symbols-outlined text-sm text-primary">trending_up</span>
                  <span className="text-emerald-600">+12% from yesterday</span>
                </>
              }
            />
            <StatCard
              icon="auto_awesome"
              iconBg="bg-tertiary/10"
              iconColor="text-tertiary"
              label="AI Resolution Rate"
              value={mockStats.aiRate}
              footer={
                <>
                  <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                  <span className="text-emerald-600">Optimized flow</span>
                </>
              }
            />
            <StatCard
              icon="speed"
              iconBg="bg-secondary/10"
              iconColor="text-secondary"
              label="Avg. Response Time"
              value={mockStats.responseTime}
              footer={
                <>
                  <span className="material-symbols-outlined text-sm text-secondary">speed</span>
                  <span className="text-secondary">Below SLA threshold</span>
                </>
              }
            />
            <StatCard
              icon="priority_high"
              iconBg="bg-error/10"
              iconColor="text-error"
              label="Escalated Today"
              value={String(mockStats.escalatedToday).padStart(2, '0')}
              footer={
                <>
                  <span className="material-symbols-outlined text-sm text-error">priority_high</span>
                  <span className="text-error">2 critical pending</span>
                </>
              }
            />
          </div>

          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-on-surface">Recent Ticket Activity</h3>
              <div className="flex gap-sm">
                <button className="p-xs hover:bg-surface-container-low rounded">
                  <span className="material-symbols-outlined text-secondary">filter_list</span>
                </button>
                <button className="p-xs hover:bg-surface-container-low rounded">
                  <span className="material-symbols-outlined text-secondary">download</span>
                </button>
              </div>
            </div>
            <TicketTable tickets={allTickets} variant="client" />
            <div className="px-lg py-md bg-surface-container-low/50 border-t border-outline-variant flex justify-between items-center">
              <span className="text-body-sm text-secondary">Showing {allTickets.length} of {allTickets.length + 1244} tickets</span>
              <div className="flex gap-xs">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-white">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-primary bg-primary text-white text-label-sm">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-white text-label-sm">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-white text-label-sm">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-white">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <AIAssistant onTicketCreated={refreshTickets} />
    </div>
  )
}

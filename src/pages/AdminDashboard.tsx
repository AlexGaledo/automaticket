import { useEffect, useState } from 'react'
import SideNavBar from '../components/SideNavBar'
import TopNavBar from '../components/TopNavBar'
import StatCard from '../components/StatCard'
import TicketTable from '../components/TicketTable'
import { mockStats, mockAdminTickets } from '../data/mockTickets'
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
    <div className="min-h-screen bg-background">
      <SideNavBar role="admin" activePage="tickets" onNavigate={() => {}} onLogout={onLogout} />
      <TopNavBar role="admin" />

      <main className="ml-[240px] pt-16 min-h-screen">
        <div className="max-w-max-width mx-auto p-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-xl">
            <StatCard
              icon="analytics"
              iconBg="bg-primary/10"
              iconColor="text-primary"
              label="Total Tickets"
              value={mockStats.totalTickets.toLocaleString()}
              badge="MTD"
              badgeBg="bg-surface-container-low"
              badgeText="text-secondary"
              footer={
                <>
                  <span className="material-symbols-outlined text-[16px] text-primary">trending_up</span>
                  <span className="text-primary">12% vs last month</span>
                </>
              }
            />
            <StatCard
              icon="auto_awesome"
              iconBg="bg-tertiary/10"
              iconColor="text-tertiary"
              label="AI Resolved"
              value={mockStats.aiResolved.toLocaleString()}
              badge="Automation"
              badgeBg="bg-surface-container-low"
              badgeText="text-secondary"
              footer={
                <span className="text-on-secondary-container">{mockStats.aiRate} Autopilot Rate</span>
              }
            />
            <StatCard
              icon="priority_high"
              iconBg="bg-error/10"
              iconColor="text-error"
              label="Awaiting Admin"
              value={String(mockStats.awaitingAdmin)}
              badge="Action Required"
              badgeBg="bg-error-container"
              badgeText="text-error"
              footer={
                <>
                  <span className="material-symbols-outlined text-[16px] text-error">timer</span>
                  <span className="text-error">Critical Priority</span>
                </>
              }
            />
            <StatCard
              icon="speed"
              iconBg="bg-secondary/10"
              iconColor="text-secondary"
              label="Avg. Resolution Time"
              value={mockStats.avgResolution}
              footer={
                <>
                  <span className="material-symbols-outlined text-[16px] text-on-secondary-container">arrow_downward</span>
                  <span className="text-on-secondary-container">-4m improvement</span>
                </>
              }
            />
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Escalated Ticket Queue</h2>
                <p className="font-body-sm text-body-sm text-secondary">Manual intervention required for {openCount} tickets</p>
              </div>
              <div className="flex gap-md">
                <button className="flex items-center gap-sm px-md py-sm border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Filter
                </button>
                <button className="flex items-center gap-sm px-md py-sm border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-[18px]">sort</span>
                  Newest First
                </button>
              </div>
            </div>
            <TicketTable tickets={allTickets} variant="admin" onResolve={handleResolve} resolvingId={resolvingId} />
            <div className="px-lg py-md flex items-center justify-between bg-surface-container-low/50">
              <p className="font-label-sm text-label-sm text-secondary">Showing {allTickets.length} of {allTickets.length} tickets</p>
              <div className="flex gap-sm">
                <button className="p-sm rounded-lg border border-outline-variant hover:bg-surface-container-high disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button className="p-sm rounded-lg border border-outline-variant hover:bg-surface-container-high">
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-xl grid grid-cols-1 lg:grid-cols-3 gap-xl">
            <div className="lg:col-span-2 bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm h-80 relative overflow-hidden">
              <div className="flex justify-between items-center mb-lg">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Queue Trends</h3>
                <span className="font-label-sm text-label-sm text-primary">Last 24 Hours</span>
              </div>
              <div className="w-full h-48 flex items-end justify-between gap-sm px-md">
                {[40, 60, 30, 90, 50, 40, 70, 20, 85, 55].map((h, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-t-lg ${i === 3 || i === 8 ? 'bg-primary' : i >= 6 ? 'bg-primary/40' : 'bg-primary/20'}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-md px-md font-label-sm text-label-sm text-secondary">
                <span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>00:00</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-md">System Health</h3>
              <div className="space-y-lg">
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 bg-on-tertiary-container rounded-full flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">memory</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-xs">
                      <span className="font-body-sm font-bold">AI Core Load</span>
                      <span className="font-label-sm text-secondary">42%</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined">cloud_done</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-xs">
                      <span className="font-body-sm font-bold">Database Latency</span>
                      <span className="font-label-sm text-secondary">24ms</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-1.5">
                      <div className="bg-tertiary h-1.5 rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 bg-on-primary-container rounded-full flex items-center justify-center text-on-primary-fixed-variant">
                    <span className="material-symbols-outlined">security</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-xs">
                      <span className="font-body-sm font-bold">Bot Detection</span>
                      <span className="font-label-sm text-secondary">Active</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-1.5">
                      <div className="bg-primary-container h-1.5 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-lg py-sm border border-outline rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container-high transition-colors">
                View Detailed Logs
              </button>
            </div>
          </div>
        </div>
      </main>

      <button className="fixed bottom-xl right-xl bg-primary text-on-primary p-lg rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform z-50 flex items-center gap-md">
        <span className="material-symbols-outlined">support_agent</span>
        <span className="font-body-md font-bold pr-sm">Quick Resolve</span>
      </button>
    </div>
  )
}

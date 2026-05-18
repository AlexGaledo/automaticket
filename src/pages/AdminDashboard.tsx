import { useEffect, useState } from 'react'
import TicketTable from '../components/TicketTable'
import KnowledgeEditor from '../components/KnowledgeEditor'
import ThemeToggle from '../components/ThemeToggle'
import { mockAdminTickets } from '../data/mockTickets'
import { listTickets, updateTicketStatus } from '../services/api'
import { toTicket } from '../utils/tickets'
import { Ticket } from '../types'

type Tab = 'tickets' | 'knowledge'

interface AdminDashboardProps {
  onLogout: () => void
  dark: boolean
  onToggleDark: () => void
}

export default function AdminDashboard({ onLogout, dark, onToggleDark }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('tickets')
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
    <div className="min-h-screen bg-app-gradient flex flex-col">
      <header className="fixed top-0 right-0 left-0 z-40 bg-header-gradient backdrop-blur-md border-b border-slate-200 dark:border-slate-700 h-16 flex justify-between items-center px-xl theme-dark">
        <div className="flex items-center gap-md">
          <div className="w-9 h-9 rounded-lg brand-gradient flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <h1 className="font-headline-md font-bold brand-gradient-text">Automaticket</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 -mt-xs font-medium">Command Center</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle dark={dark} onToggle={onToggleDark} />
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="text-sm hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-1 pt-16 animate-fade-in">
        <div className="max-w-max-width mx-auto p-xl">
          <div className="flex gap-1 mb-lg">
            <button
              onClick={() => setTab('tickets')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === 'tickets'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
              Ticket Queue
              {openCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
                  {openCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('knowledge')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === 'knowledge'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              Knowledge Base
            </button>
          </div>

          {tab === 'tickets' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden theme-dark">
              <div className="p-lg border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-indigo-50/60 to-violet-50/60 dark:from-indigo-950/30 dark:to-violet-950/30">
                <h2 className="font-headline-md text-headline-md font-bold text-slate-900 dark:text-slate-100">Escalated Ticket Queue</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manual intervention required for {openCount} tickets</p>
              </div>
              <TicketTable tickets={allTickets} variant="admin" onResolve={handleResolve} resolvingId={resolvingId} />
            </div>
          )}

          {tab === 'knowledge' && <KnowledgeEditor />}
        </div>
      </main>
    </div>
  )
}

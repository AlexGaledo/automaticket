import { useEffect, useState } from 'react'
import AIAssistant from '../components/AIAssistant'
import ThemeToggle from '../components/ThemeToggle'
import { listTickets } from '../services/api'
import { toTicket } from '../utils/tickets'
import { Ticket } from '../types'

interface ClientDashboardProps {
  onLogout: () => void
  dark: boolean
  onToggleDark: () => void
}

export default function ClientDashboard({ onLogout, dark, onToggleDark }: ClientDashboardProps) {
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

  return (
    <div className="min-h-screen bg-app-gradient flex flex-col">
      <header className="fixed top-0 right-0 left-0 z-40 bg-header-gradient backdrop-blur-md border-b border-slate-200 dark:border-slate-700 h-16 flex justify-between items-center px-xl theme-dark">
        <div className="flex items-center gap-md">
          <div className="w-9 h-9 rounded-lg brand-gradient flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <h1 className="font-headline-md font-bold brand-gradient-text">Automaticket</h1>
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

      <main className="flex-1 pt-16 min-h-0 flex animate-fade-in">
        <div className="flex-1 p-lg md:p-xl min-w-0 max-w-[900px] mx-auto w-full">
          <AIAssistant onTicketCreated={refreshTickets} variant="page" />
        </div>
      </main>
    </div>
  )
}

import { useEffect, useState } from 'react'
import AIAssistant from '../components/AIAssistant'
import ThemeToggle from '../components/ThemeToggle'
import TicketTable from '../components/TicketTable'
import { listTickets } from '../services/api'
import { toTicket } from '../utils/tickets'
import { Ticket } from '../types'

interface ClientDashboardProps {
  onLogout: () => void
  dark: boolean
  onToggleDark: () => void
}

export default function ClientDashboard({ onLogout, dark, onToggleDark }: ClientDashboardProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])

  async function refreshTickets() {
    try {
      const list = await listTickets()
      setTickets(list.map(toTicket))
    } catch { /* keep prev */ }
  }
  useEffect(() => { refreshTickets() }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Masthead */}
      <header className="border-b border-outline">
        <div className="max-w-max-width mx-auto px-xl py-md flex items-end justify-between">
          <div className="flex items-baseline gap-6">
            <h1 className="display text-headline-lg text-ink-900 leading-none">
              <span className="italic" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}>auto</span>ticket<span className="text-clay-500">.</span>
            </h1>
            <span className="eyebrow hidden md:inline">Client Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle dark={dark} onToggle={onToggleDark} />
            <button onClick={onLogout} className="btn btn-ghost text-body-sm px-3">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
        <div className="max-w-max-width mx-auto px-xl"><div className="rule-thick" /></div>
      </header>

      <main className="flex-1 animate-fade-in">
        <div className="max-w-max-width mx-auto px-xl py-xl grid grid-cols-12 gap-6">

          {/* Left: Intro + recent tickets */}
          <section className="col-span-12 lg:col-span-5 flex flex-col gap-md">
            <div>
              <span className="eyebrow text-clay-500">Welcome back</span>
              <h2 className="display text-display-md text-ink-900 mt-2 leading-[1.02] text-balance">
                <span className="italic" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'wght' 400" }}>How can</span> we help today?
              </h2>
              <p className="text-body-lg text-ink-700 mt-3 max-w-md text-pretty">
                Describe your issue to the assistant. If it can't resolve the request,
                a human operator will pick it up automatically.
              </p>
            </div>

            <div className="card p-lg mt-2">
              <div className="flex items-center justify-between mb-md">
                <span className="eyebrow">Your recent tickets</span>
                <button className="font-mono text-mono-xs uppercase tracking-widest text-clay-500">View all →</button>
              </div>
              {tickets.length === 0 ? (
                <div className="surface-inset rounded p-md text-center">
                  <p className="display italic text-headline-sm text-ink-700"
                     style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}>
                    Nothing on file.
                  </p>
                  <p className="text-body-sm text-ink-500 mt-1">Ask the assistant — that'll change.</p>
                </div>
              ) : (
                <TicketTable tickets={tickets.slice(0, 4)} variant="client" compact />
              )}
            </div>
          </section>

          {/* Right: Assistant */}
          <section className="col-span-12 lg:col-span-7 h-[calc(100vh-200px)] min-h-[600px]">
            <AIAssistant onTicketCreated={refreshTickets} variant="page" />
          </section>
        </div>
      </main>
    </div>
  )
}

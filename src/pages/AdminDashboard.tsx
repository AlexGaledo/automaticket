import { useEffect, useState } from 'react'
import TicketTable from '../components/TicketTable'
import KnowledgeEditor from '../components/KnowledgeEditor'
import ThemeToggle from '../components/ThemeToggle'
import StatCard from '../components/StatCard'
import { mockAdminTickets } from '../data/mockTickets'
import { listTickets, updateTicketStatus, getNotificationEmail, updateNotificationEmail } from '../services/api'
import { toTicket } from '../utils/tickets'
import { Ticket } from '../types'

type Tab = 'tickets' | 'knowledge' | 'settings'

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
  const [notifEmail, setNotifEmail] = useState('')
  const [savedNotifEmail, setSavedNotifEmail] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  const [emailLoading, setEmailLoading] = useState(true)
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function refreshTickets() {
    try {
      const list = await listTickets()
      setBackendTickets(list.map(toTicket))
    } catch { /* ignore */ }
  }

  useEffect(() => { refreshTickets() }, [])

  useEffect(() => {
    getNotificationEmail()
      .then((res) => { setNotifEmail(res.email); setSavedNotifEmail(res.email) })
      .catch(() => setEmailMessage({ type: 'error', text: 'Failed to load notification email.' }))
      .finally(() => setEmailLoading(false))
  }, [])

  async function handleSaveEmail() {
    setSavingEmail(true); setEmailMessage(null)
    try {
      const res = await updateNotificationEmail(notifEmail)
      setSavedNotifEmail(res.email)
      setEmailMessage({ type: 'success', text: 'Notification email saved.' })
    } catch { setEmailMessage({ type: 'error', text: 'Save failed.' }) }
    finally { setSavingEmail(false) }
  }

  async function handleResolve(id: string) {
    setResolvingId(id)
    const backendMatch = backendTickets.find((t) => t.id === id)
    if (backendMatch) {
      try {
        const rawId = id.startsWith('#') ? id.slice(1) : id
        await updateTicketStatus(rawId, 'Resolved')
        setBackendTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t)))
      } catch { /* ignore */ }
    } else {
      setMockTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Resolved' } : t)))
    }
    setResolvingId(null)
  }

  const allTickets = [...backendTickets, ...mockTickets]
  const openCount = allTickets.filter((t) => t.status !== 'Resolved').length
  const resolvedCount = allTickets.filter((t) => t.status === 'Resolved').length
  const escalatedCount = allTickets.filter((t) => t.status === 'Escalated').length

  return (
    <div className="min-h-screen flex flex-col">
      {/* Editorial masthead */}
      <header className="border-b border-outline">
        <div className="max-w-max-width mx-auto px-xl py-md flex items-end justify-between">
          <div className="flex items-baseline gap-6">
            <h1 className="display text-headline-lg text-ink-900 leading-none">
              <span className="italic" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}>auto</span>ticket<span className="text-clay-500">.</span>
            </h1>
            <span className="eyebrow hidden md:inline">Operator Console / Vol. II</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-2 eyebrow">
              <span className="status-dot bg-moss-500 animate-pulse-soft" /> Live
            </span>
            <ThemeToggle dark={dark} onToggle={onToggleDark} />
            <button onClick={onLogout} className="btn btn-ghost text-body-sm px-3">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/* Thick rule */}
        <div className="max-w-max-width mx-auto px-xl">
          <div className="rule-thick" />
        </div>

        {/* Date / metadata strip */}
        <div className="max-w-max-width mx-auto px-xl py-2 flex justify-between items-center text-ink-500 font-mono text-mono-xs uppercase tracking-widest">
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
          <span>Tickets in queue · {openCount}</span>
          <span className="hidden md:inline">Resolved today · {resolvedCount}</span>
        </div>
      </header>

      <main className="flex-1 animate-fade-in">
        <div className="max-w-max-width mx-auto px-xl py-xl">

          {/* Page title — editorial */}
          <div className="mb-xl">
            <span className="eyebrow text-clay-500">Section 02 — Operations</span>
            <h2 className="display text-display-md text-ink-900 mt-2 text-balance">
              <span className="italic" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'wght' 400" }}>What needs</span> your attention.
            </h2>
            <p className="text-body-lg text-ink-700 mt-2 max-w-2xl text-pretty">
              The assistant resolved <span className="font-mono tabular text-moss-500">{resolvedCount}</span> requests automatically.
              <span className="font-mono tabular text-clay-500"> {openCount}</span> have been routed here for human judgment.
            </p>
          </div>

          {/* KPI strip */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-xl">
            <StatCard series="01 / Queue" label="Open tickets" value={String(openCount).padStart(2,'0')} tone="ink" footer={<span className="eyebrow">↑ from yesterday</span>} />
            <StatCard series="02 / Resolved" label="By assistant" value={String(resolvedCount).padStart(2,'0')} tone="moss" footer={<span className="chip chip-moss">AI</span>} />
            <StatCard series="03 / Escalated" label="Needs review" value={String(escalatedCount).padStart(2,'0')} tone="clay" footer={<span className="chip chip-clay">Now</span>} />
          </section>

          {/* Tabs */}
          <div className="flex gap-1 mb-md border-b border-outline">
            <TabButton active={tab === 'tickets'} onClick={() => setTab('tickets')} num="01" label="Ticket queue" count={openCount} />
            <TabButton active={tab === 'knowledge'} onClick={() => setTab('knowledge')} num="02" label="Knowledge base" />
            <TabButton active={tab === 'settings'} onClick={() => setTab('settings')} num="03" label="Settings" />
          </div>

          {tab === 'tickets' && (
            <section className="card overflow-hidden">
              <div className="px-lg py-md border-b border-outline flex items-end justify-between flex-wrap gap-3">
                <div>
                  <span className="eyebrow">Manual intervention</span>
                  <h3 className="display text-headline-md text-ink-900 mt-1">Escalated queue</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-secondary text-xs px-3 py-1.5">Filter</button>
                  <button className="btn btn-secondary text-xs px-3 py-1.5">Export</button>
                </div>
              </div>
              <TicketTable tickets={allTickets} variant="admin" onResolve={handleResolve} resolvingId={resolvingId} />
            </section>
          )}

          {tab === 'knowledge' && <KnowledgeEditor />}

          {tab === 'settings' && (
            <section className="card overflow-hidden">
              <header className="px-lg py-md border-b border-outline">
                <div>
                  <span className="eyebrow">Configuration</span>
                  <h2 className="display text-headline-md text-ink-900 mt-1">Notification email</h2>
                  <p className="text-body-sm text-ink-500 mt-0.5">Email address where ticket notifications will be sent.</p>
                </div>
              </header>

              {emailMessage && (
                <div className={`px-lg py-2 text-body-sm border-b border-outline-soft ${
                  emailMessage.type === 'success'
                    ? 'bg-moss-50 text-moss-700 dark:bg-moss-800/30 dark:text-moss-100'
                    : 'bg-brick-50 text-brick-700 dark:bg-brick-700/20 dark:text-brick-100'
                }`}>
                  {emailMessage.text}
                </div>
              )}

              <div className="px-lg py-lg space-y-4">
                <div>
                  <label className="eyebrow block mb-2">Email address</label>
                  <input
                    type="email"
                    value={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.value)}
                    placeholder="notifications@example.com"
                    className="w-full max-w-md px-4 py-2.5 font-mono text-mono-sm text-ink-900 bg-surface
                               border border-outline rounded focus:outline-none focus:border-clay-500
                               placeholder:text-ink-300"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveEmail}
                    disabled={savingEmail || emailLoading || notifEmail === savedNotifEmail}
                    className="btn btn-primary text-xs px-4 py-1.5 disabled:opacity-40"
                  >
                    {savingEmail ? 'Saving…' : 'Save'}
                  </button>
                  {savedNotifEmail && (
                    <span className="font-mono text-mono-xs text-ink-500 tabular">
                      Current: {savedNotifEmail}
                    </span>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <footer className="border-t border-outline mt-xl">
        <div className="max-w-max-width mx-auto px-xl py-md flex justify-between items-center text-body-sm text-ink-500">
          <p className="display italic" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}>Precision, with restraint.</p>
          <p className="font-mono text-mono-xs uppercase tracking-widest">© Automaticket · v2.4</p>
        </div>
      </footer>
    </div>
  )
}

function TabButton({ active, onClick, num, label, count }: {
  active: boolean; onClick: () => void; num: string; label: string; count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-3 px-4 py-3 transition-colors ${
        active ? 'text-ink-900' : 'text-ink-500 hover:text-ink-700'
      }`}
    >
      <span className={`font-mono text-mono-xs ${active ? 'text-clay-500' : 'text-ink-300'}`}>{num}</span>
      <span className="text-body-md tracking-tight">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="chip chip-clay">{count}</span>
      )}
      {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-clay-500" />}
    </button>
  )
}

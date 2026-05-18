import { UserRole } from '../types'

interface SideNavBarProps {
  role: UserRole
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

const navItems = [
  { icon: 'dashboard', label: 'Overview', id: 'dashboard', num: '01' },
  { icon: 'confirmation_number', label: 'Tickets', id: 'tickets', num: '02' },
  { icon: 'precision_manufacturing', label: 'Automations', id: 'automation', num: '03' },
  { icon: 'settings', label: 'Settings', id: 'settings', num: '04' },
]

export default function SideNavBar({ role, activePage, onNavigate, onLogout }: SideNavBarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] z-40 surface border-r border-outline flex flex-col py-lg px-md">
      {/* Wordmark — serif, italic 'a' */}
      <div className="mb-xl px-sm">
        <h1 className="display text-headline-lg text-ink-900 leading-none">
          <span className="italic" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}>auto</span>ticket<span className="text-clay-500">.</span>
        </h1>
        <p className="eyebrow mt-2">
          {role === 'admin' ? 'Ops Console' : 'Client Portal'}
        </p>
      </div>

      <div className="rule mb-md" />

      <nav className="flex-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group w-full flex items-center gap-3 pl-3 pr-2 py-2 rounded text-left transition-all
                ${isActive
                  ? 'bg-clay-50 text-ink-900 dark:bg-clay-900/40'
                  : 'text-ink-700 hover:bg-outline-soft'
                }`}
            >
              <span className={`font-mono text-mono-xs ${isActive ? 'text-clay-500' : 'text-ink-300 group-hover:text-ink-500'}`}>
                {item.num}
              </span>
              <span className="text-body-md tracking-tight flex-1">{item.label}</span>
              {isActive && <span className="status-dot bg-clay-500" />}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto space-y-2">
        <button className="btn btn-primary w-full">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New ticket
        </button>
        <button className="btn btn-ghost w-full justify-start gap-3 px-3">
          <span className="material-symbols-outlined text-[18px]">help_outline</span>
          <span className="text-body-md">Support</span>
        </button>
        <button
          onClick={onLogout}
          className="btn btn-ghost w-full justify-start gap-3 px-3"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="text-body-md">Sign out</span>
        </button>
      </div>
    </aside>
  )
}

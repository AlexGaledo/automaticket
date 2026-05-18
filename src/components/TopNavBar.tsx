import { UserRole } from '../types'

interface TopNavBarProps {
  role: UserRole
}

export default function TopNavBar({ role }: TopNavBarProps) {
  return (
    <header className="fixed top-0 right-0 left-[240px] z-30 h-16 px-xl
                       bg-surface/85 backdrop-blur-md border-b border-outline
                       flex justify-between items-center">
      <div className="flex items-center gap-md flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 text-[18px]">search</span>
          <input
            className="field pl-9"
            placeholder="Search tickets, clients, flows…"
            type="text"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-mono-xs text-ink-500
                         border border-outline rounded px-1.5 py-0.5">⌘K</kbd>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="eyebrow hidden md:inline">{role === 'admin' ? 'Operator' : 'Client'}</span>
        <div className="h-5 w-px bg-outline hidden md:block" />
        <button className="btn btn-ghost p-2" aria-label="Notifications">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>
        <button className="btn btn-ghost p-2" aria-label="History">
          <span className="material-symbols-outlined text-[20px]">history</span>
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-outline">
          <div className="w-8 h-8 rounded-full bg-clay-500 text-cream-50
                          flex items-center justify-center font-mono text-mono-xs">
            {role === 'admin' ? 'OP' : 'CL'}
          </div>
        </div>
      </div>
    </header>
  )
}

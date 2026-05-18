import { UserRole } from '../types'

interface SideNavBarProps {
  role: UserRole
  activePage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

const adminNavItems = [
  { icon: 'dashboard', label: 'Dashboard', id: 'dashboard' },
  { icon: 'confirmation_number', label: 'Ticket Queue', id: 'tickets' },
  { icon: 'precision_manufacturing', label: 'Automation Flows', id: 'automation' },
  { icon: 'settings', label: 'System Settings', id: 'settings' },
]

const clientNavItems = [
  { icon: 'dashboard', label: 'Dashboard', id: 'dashboard' },
  { icon: 'confirmation_number', label: 'Ticket Queue', id: 'tickets' },
  { icon: 'precision_manufacturing', label: 'Automation Flows', id: 'automation' },
  { icon: 'settings', label: 'System Settings', id: 'settings' },
]

export default function SideNavBar({ role, activePage, onNavigate, onLogout }: SideNavBarProps) {
  const items = role === 'admin' ? adminNavItems : clientNavItems

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] z-50 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm flex flex-col py-lg px-md theme-dark">
      <div className="mb-xl px-sm">
        <div className="flex items-center gap-sm mb-xs">
          <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <h1 className="font-sans text-headline-md font-bold brand-gradient-text">Automaticket</h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{role === 'admin' ? 'Command Center' : 'Precision Ops'}</p>
      </div>
      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-md px-md py-sm rounded-lg transition-all duration-200 text-left ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 border-r-4 border-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950/40'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
      <div className="mt-auto space-y-1 border-t border-slate-200 dark:border-slate-700 pt-md">
        {role === 'admin' && (
          <button className="w-full mb-md bg-indigo-600 text-white py-sm px-md rounded-lg text-sm font-semibold hover:bg-indigo-700 active:scale-[0.99] transition-all">
            Create Ticket
          </button>
        )}
        {role === 'client' && (
          <button className="mb-md w-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 py-sm px-md rounded-xl font-bold flex items-center justify-center gap-sm shadow-sm active:scale-[0.98] transition-all text-sm">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 600" }}>add</span>
            Create Ticket
          </button>
        )}
        <button className="w-full flex items-center gap-md px-md py-sm rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
          <span className="material-symbols-outlined">help</span>
          <span className="text-sm font-medium">Support</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-md px-md py-sm rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}

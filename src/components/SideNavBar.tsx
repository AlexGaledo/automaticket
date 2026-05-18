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
    <aside className="fixed left-0 top-0 h-screen w-[240px] z-50 bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col py-lg px-md">
      <div className="mb-xl px-sm">
        <h1 className="font-sans text-headline-md font-bold text-primary">AutoTicket</h1>
        <p className="font-label-md text-label-md text-secondary">{role === 'admin' ? 'Command Center' : 'Precision Ops'}</p>
      </div>
      <nav className="flex-1 space-y-xs">
        {items.map((item) => {
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-md px-md py-sm rounded-lg transition-all duration-200 text-left ${
                isActive
                  ? 'text-primary border-r-4 border-primary font-bold bg-surface-container-low'
                  : 'text-secondary hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-md text-body-md">{item.label}</span>
            </button>
          )
        })}
      </nav>
      <div className="mt-auto space-y-xs border-t border-outline-variant pt-md">
        {role === 'admin' && (
          <button className="w-full mb-md bg-primary text-on-primary py-sm px-md rounded-lg font-body-md font-bold hover:opacity-90 active:scale-[0.99] transition-transform">
            Create Ticket
          </button>
        )}
        {role === 'client' && (
          <button className="mb-md w-full bg-primary-container text-on-primary py-sm px-md rounded-xl font-bold flex items-center justify-center gap-sm shadow-md active:scale-[0.98] transition-transform">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 600" }}>add</span>
            Create Ticket
          </button>
        )}
        <button className="w-full flex items-center gap-md px-md py-sm rounded-lg text-secondary hover:bg-surface-container-low transition-colors duration-200">
          <span className="material-symbols-outlined">help</span>
          <span className="font-body-md text-body-md">Support</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-md px-md py-sm rounded-lg text-secondary hover:bg-surface-container-low transition-colors duration-200"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md text-body-md">Logout</span>
        </button>
      </div>
    </aside>
  )
}

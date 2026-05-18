import { UserRole } from '../types'

interface TopNavBarProps {
  role: UserRole
}

export default function TopNavBar({ role }: TopNavBarProps) {
  return (
    <header className="fixed top-0 right-0 left-[240px] z-40 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant h-16 flex justify-between items-center px-xl">
      <div className="flex items-center gap-md flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
          <input
            className="w-full bg-surface-container-low border-none rounded-xl pl-xl pr-md py-sm font-body-sm focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="Search Command Center..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-lg">
        {role === 'admin' && (
          <button className="bg-primary-container text-on-primary py-xs px-md rounded-lg font-label-md text-label-md hover:opacity-90">
            Escalate Ticket
          </button>
        )}
        {role === 'client' && (
          <button className="bg-primary text-on-primary px-md py-sm rounded-lg font-bold text-body-sm active:opacity-90 transition-opacity">
            Escalate Ticket
          </button>
        )}
        <div className="flex items-center gap-md text-secondary">
          <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-all">notifications</span>
          <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-all">history</span>
          <div className="flex items-center gap-sm cursor-pointer hover:text-primary transition-all ml-md">
            <span className="material-symbols-outlined">account_circle</span>
            <span className="font-body-sm">{role === 'admin' ? 'Admin' : 'Client'}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

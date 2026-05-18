import ThemeToggle from '../components/ThemeToggle'

interface AuthPageProps {
  onEnter: (role: 'admin' | 'client') => void
  dark: boolean
  onToggleDark: () => void
}

export default function AuthPage({ onEnter, dark, onToggleDark }: AuthPageProps) {
  return (
    <div className="min-h-screen bg-app-gradient-intense flex flex-col">
      <header className="w-full py-xl px-xl flex justify-between items-center">
        <div className="flex items-center gap-md animate-fade-in">
          <div className="w-12 h-12 rounded-xl brand-gradient flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <h1 className="font-sans text-headline-lg font-bold brand-gradient-text tracking-tight">Automaticket</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 -mt-xs font-medium">High-Velocity Customer Service Automation</p>
          </div>
        </div>
        <ThemeToggle dark={dark} onToggle={onToggleDark} />
      </header>

      <main className="flex-grow flex items-center justify-center px-md md:px-xl">
        <div className="max-w-[1000px] w-full grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-xl shadow-card card-hover flex flex-col items-center text-center animate-slide-up theme-dark">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 rounded-l-xl" />
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mb-lg group-hover:scale-110 transition-transform duration-200">
              <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-[32px]">admin_panel_settings</span>
            </div>
            <h2 className="font-headline-md text-headline-md mb-sm text-slate-900 dark:text-slate-100">Login as Admin</h2>
            <p className="text-slate-500 dark:text-slate-400 font-body-sm mb-xl leading-relaxed">Access the Command Center to manage tickets, configure automation flows, and monitor system health.</p>
            <button
              onClick={() => onEnter('admin')}
              className="w-full bg-indigo-600 text-white font-body-md py-md rounded-lg hover:bg-indigo-700 active:scale-[0.98] transition-all mb-lg font-medium"
            >
              Enter Command Center
            </button>
            <div className="w-full bg-slate-50 dark:bg-slate-700/50 rounded-lg p-md border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-xs mb-xs">
                <span className="material-symbols-outlined text-sm text-slate-400 dark:text-slate-500">info</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Demo Credentials</span>
              </div>
              <div className="flex flex-col gap-xs text-left">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Email:</span>
                  <code className="text-xs text-indigo-600 dark:text-indigo-400 select-all font-medium bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded">admin@automaticket.io</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Pass:</span>
                  <code className="text-xs text-indigo-600 dark:text-indigo-400 select-all font-medium bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded">password</code>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-xl shadow-card card-hover flex flex-col items-center text-center animate-slide-up theme-dark" style={{ animationDelay: '0.1s' }}>
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-600 rounded-l-xl" />
            <div className="w-16 h-16 bg-violet-50 dark:bg-violet-950/40 rounded-full flex items-center justify-center mb-lg group-hover:scale-110 transition-transform duration-200">
              <span className="material-symbols-outlined text-violet-600 dark:text-violet-400 text-[32px]">person</span>
            </div>
            <h2 className="font-headline-md text-headline-md mb-sm text-slate-900 dark:text-slate-100">Login as Client</h2>
            <p className="text-slate-500 dark:text-slate-400 font-body-sm mb-xl leading-relaxed">Submit new requests, track ticket progress in real-time, and communicate with your dedicated Customer Service team.</p>
            <button
              onClick={() => onEnter('client')}
              className="w-full brand-gradient text-white font-body-md py-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all mb-lg font-medium"
            >
              Access Portal
            </button>
            <div className="w-full bg-slate-50 dark:bg-slate-700/50 rounded-lg p-md border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-xs mb-xs">
                <span className="material-symbols-outlined text-sm text-slate-400 dark:text-slate-500">info</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Demo Credentials</span>
              </div>
              <div className="flex flex-col gap-xs text-left">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Email:</span>
                  <code className="text-xs text-violet-600 dark:text-violet-400 select-all font-medium bg-violet-50 dark:bg-violet-950/40 px-1.5 py-0.5 rounded">client@automaticket.io</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-300">Pass:</span>
                  <code className="text-xs text-violet-600 dark:text-violet-400 select-all font-medium bg-violet-50 dark:bg-violet-950/40 px-1.5 py-0.5 rounded">password</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-xl px-xl text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500">&copy; 2024 Automaticket Precision Ops. High-Velocity Customer Service Automation.</p>
      </footer>
    </div>
  )
}

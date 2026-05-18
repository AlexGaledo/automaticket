interface AuthPageProps {
  onEnter: (role: 'admin' | 'client') => void
}

export default function AuthPage({ onEnter }: AuthPageProps) {
  return (
    <div className="min-h-screen flex flex-col"
      style={{
        backgroundColor: '#f8f9ff',
        backgroundImage: 'radial-gradient(at 0% 0%, #d3e4fe 0px, transparent 50%), radial-gradient(at 100% 100%, #e5eeff 0px, transparent 50%)',
      }}
    >
      <header className="w-full py-xl px-xl flex justify-center">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
          <h1 className="font-sans text-headline-lg text-primary tracking-tight">AutoTicket</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-md md:px-xl">
        <div className="max-w-[1000px] w-full grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div className="group relative bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl" />
            <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-[32px]">admin_panel_settings</span>
            </div>
            <h2 className="font-headline-md text-headline-md mb-sm text-on-surface">Login as Admin</h2>
            <p className="text-on-surface-variant font-body-sm mb-xl">Access the Command Center to manage tickets, configure automation flows, and monitor system health.</p>
            <button
              onClick={() => onEnter('admin')}
              className="w-full bg-primary text-on-primary font-body-md py-md rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all mb-lg"
            >
              Enter Command Center
            </button>
            <div className="w-full bg-surface-container-low rounded-lg p-md border border-outline-variant/30">
              <div className="flex items-center gap-xs mb-xs">
                <span className="material-symbols-outlined text-sm text-secondary">info</span>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Demo Credentials</span>
              </div>
              <div className="flex flex-col gap-xs text-left">
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md text-on-surface-variant">Email:</span>
                  <code className="font-label-md text-label-md text-primary select-all">admin@autoticket.io</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md text-on-surface-variant">Pass:</span>
                  <code className="font-label-md text-label-md text-primary select-all">password</code>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center">
            <div className="absolute top-0 left-0 w-1 h-full bg-tertiary rounded-l-xl" />
            <div className="w-16 h-16 bg-tertiary-fixed rounded-full flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-tertiary text-[32px]">person</span>
            </div>
            <h2 className="font-headline-md text-headline-md mb-sm text-on-surface">Login as Client</h2>
            <p className="text-on-surface-variant font-body-sm mb-xl">Submit new requests, track ticket progress in real-time, and communicate with your dedicated VA team.</p>
            <button
              onClick={() => onEnter('client')}
              className="w-full bg-tertiary text-on-tertiary font-body-md py-md rounded-lg hover:bg-tertiary-container active:scale-[0.98] transition-all mb-lg"
            >
              Access Portal
            </button>
            <div className="w-full bg-surface-container-low rounded-lg p-md border border-outline-variant/30">
              <div className="flex items-center gap-xs mb-xs">
                <span className="material-symbols-outlined text-sm text-secondary">info</span>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Demo Credentials</span>
              </div>
              <div className="flex flex-col gap-xs text-left">
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md text-on-surface-variant">Email:</span>
                  <code className="font-label-md text-label-md text-tertiary select-all">client@demo.com</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md text-on-surface-variant">Pass:</span>
                  <code className="font-label-md text-label-md text-tertiary select-all">password</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-xl px-xl text-center">
        <p className="font-label-md text-label-md text-outline">&copy; 2024 AutoTicket Precision Ops. High-Velocity VA Automation.</p>
      </footer>
    </div>
  )
}

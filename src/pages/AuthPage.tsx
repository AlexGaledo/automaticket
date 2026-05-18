import ThemeToggle from '../components/ThemeToggle'

interface AuthPageProps {
  onEnter: (role: 'admin' | 'client') => void
  dark: boolean
  onToggleDark: () => void
}

export default function AuthPage({ onEnter, dark, onToggleDark }: AuthPageProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="w-full px-xl py-md flex justify-between items-center">
        <span className="font-mono text-mono-xs text-ink-500 uppercase tracking-widest animate-fade-in">
          est. 2026 · Soft Ops
        </span>
        <ThemeToggle dark={dark} onToggle={onToggleDark} />
      </header>

      {/* Centered hero + role doors stacked below */}
      <main className="flex-grow flex flex-col items-center justify-center px-xl py-xl">
        {/* Hero — centered */}
        <section className="flex flex-col items-center text-center animate-rise max-w-3xl">
          <span className="eyebrow text-clay-500">Issue №01 · Customer Service Automation</span>

          <h1
            className="display text-ink-900 mt-4 leading-[0.9] text-balance"
            style={{
              fontSize: 'clamp(64px, 11vw, 156px)',
              fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'wght' 450",
            }}
          >
            <span
              className="italic"
              style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'wght' 350" }}
            >
              auto
            </span>
            ticket<span className="text-clay-500">.</span>
          </h1>

          <p
            className="display text-headline-md italic text-ink-700 mt-5 max-w-xl text-balance"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'wght' 350" }}
          >
            A quiet operations console for tickets that resolve themselves —
            and the few that don't.
          </p>

          <div className="mt-6 flex items-center justify-center gap-6 text-body-sm text-ink-500">
            <span className="flex items-center gap-2">
              <span className="status-dot bg-moss-500 animate-pulse-soft" />
              All systems nominal
            </span>
            <span className="hidden sm:inline font-mono tabular">AI resolve rate · 87.4%</span>
          </div>
        </section>

        {/* Decorative rule */}
        <div className="w-24 h-px bg-outline my-xl" />

        {/* Role doors — side-by-side, centered */}
        <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
          <RoleDoor
            kicker="01 / Operators"
            title="Command desk"
            blurb="Triage escalations, tune automations, edit the knowledge base."
            cta="Enter as operator"
            tone="clay"
            email="admin@automaticket.io"
            onEnter={() => onEnter('admin')}
            delay={0}
          />
          <RoleDoor
            kicker="02 / Clients"
            title="Self-service"
            blurb="Talk to the assistant. Track progress. Get answers fast."
            cta="Enter as client"
            tone="moss"
            email="client@automaticket.io"
            onEnter={() => onEnter('client')}
            delay={0.08}
          />
        </section>
      </main>

      <footer className="px-xl pb-md pt-xl flex justify-between items-end text-body-sm text-ink-500">
        <p
          className="display italic"
          style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100" }}
        >
          Precision, with restraint.
        </p>
        <p className="font-mono text-mono-xs uppercase tracking-widest">© Automaticket · v2.4</p>
      </footer>
    </div>
  )
}

function RoleDoor({
  kicker, title, blurb, cta, tone, email, onEnter, delay,
}: {
  kicker: string; title: string; blurb: string; cta: string;
  tone: 'clay' | 'moss'; email: string; onEnter: () => void; delay: number;
}) {
  const accent = tone === 'clay' ? 'text-clay-500' : 'text-moss-500'
  return (
    <button
      onClick={onEnter}
      style={{ animationDelay: `${delay}s` }}
      className="group text-left card p-lg animate-rise hover:shadow-lift transition-shadow relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-ink-900/85" />
      <div className="flex items-start justify-between mb-md">
        <span className={`eyebrow ${accent}`}>{kicker}</span>
        <span className="font-mono text-mono-xs text-ink-500 group-hover:translate-x-1 transition-transform">→</span>
      </div>
      <h2 className="display text-headline-lg text-ink-900 leading-tight">{title}</h2>
      <p className="text-body-md text-ink-700 mt-1 text-pretty">{blurb}</p>
      <div className="rule my-md" />
      <div className="flex items-center justify-between">
        <span className={`text-body-md ${accent}`}>{cta}</span>
        <code className="font-mono text-mono-xs text-ink-500 bg-outline-soft px-2 py-0.5 rounded">
          {email}
        </code>
      </div>
    </button>
  )
}

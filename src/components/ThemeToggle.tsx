interface ThemeToggleProps {
  dark: boolean
  onToggle: () => void
}

export default function ThemeToggle({ dark, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="group relative flex items-center gap-2 h-9 px-3 rounded
                 border border-outline hover:border-ink-300
                 text-ink-700 hover:text-ink-900 transition-colors
                 font-mono text-mono-xs uppercase tracking-widest"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="text-base leading-none">{dark ? '◐' : '◑'}</span>
      <span className="hidden sm:inline">{dark ? 'Dark' : 'Light'}</span>
    </button>
  )
}

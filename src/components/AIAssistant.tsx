import { useState } from 'react'
import { processAiQuery, createTicket } from '../services/api'

interface Message {
  role: 'assistant' | 'user'
  text: string
  isTicketNotice?: boolean
}

interface AIAssistantProps {
  onTicketCreated?: () => void
  variant?: 'drawer' | 'page'
}

export default function AIAssistant({ onTicketCreated, variant = 'drawer' }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hello — describe what's troubling you and I'll do my best to resolve it on the spot." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const quickActions = [
    'Status of ticket TK-89025',
    'Reset my password',
    'Export this month\'s report',
  ]

  async function handleSend(text: string) {
    const msg = text.trim()
    if (!msg || loading) return

    setMessages((prev) => [...prev, { role: 'user', text: msg }])
    setInput('')
    setLoading(true)

    try {
      const result = await processAiQuery(msg)
      setMessages((prev) => [...prev, { role: 'assistant', text: result.response }])

      if (result.should_escalate) {
        try {
          const subject = msg.length > 80 ? msg.slice(0, 80) + '…' : msg
          const ticket = await createTicket(subject, msg, 'High', 'Escalated')
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              text: `I couldn't fully resolve that one. I've opened ticket ${ticket.id} on your behalf — a human operator will pick it up shortly.`,
              isTicketNotice: true,
            },
          ])
          onTicketCreated?.()
        } catch {
          setMessages((prev) => [...prev, { role: 'assistant', text: 'Tried to open a ticket but the request failed. Please try again.' }])
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry — I hit an error. Please retry.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }

  const containerClass =
    variant === 'page'
      ? 'flex flex-col h-full card overflow-hidden'
      : 'fixed right-0 top-0 h-screen w-[380px] z-50 flex flex-col card rounded-none border-l border-outline shadow-lift'

  return (
    <aside className={containerClass}>
      {/* Header — moss accent for AI */}
      <div className="px-lg py-md border-b border-outline-soft bg-outline-soft/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-moss-100 dark:bg-moss-800 ai-glow
                          flex items-center justify-center">
            <span className="material-symbols-outlined text-moss-500 dark:text-moss-100 text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div>
            <h4 className="display text-headline-sm text-ink-900 leading-none">Assistant</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="status-dot bg-moss-500 animate-pulse-soft" />
              <span className="eyebrow text-moss-500 dark:text-moss-200">Listening</span>
            </div>
          </div>
        </div>
        <span className="font-mono text-mono-xs text-ink-500 uppercase">v2.4</span>
      </div>

      {/* Messages */}
      <div className="flex-grow px-lg py-md overflow-y-auto space-y-4 scrollbar-thin">
        {messages.map((m, i) => {
          if (m.isTicketNotice) {
            return (
              <div key={i} className="animate-fade-in-fast">
                <div className="border-l-2 border-clay-500 pl-3 py-1 bg-clay-50 dark:bg-clay-900/30 rounded-r">
                  <div className="eyebrow text-clay-500 mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">add_task</span>
                    Ticket opened
                  </div>
                  <p className="text-body-md text-ink-900">{m.text}</p>
                </div>
              </div>
            )
          }
          const isAssistant = m.role === 'assistant'
          return (
            <div key={i} className={`animate-fade-in-fast ${isAssistant ? '' : 'flex justify-end'}`}>
              <div className={`max-w-[88%] ${isAssistant ? '' : ''}`}>
                <div className={`eyebrow mb-1 ${isAssistant ? 'text-moss-500' : 'text-clay-500 text-right'}`}>
                  {isAssistant ? '— Assistant' : 'You —'}
                </div>
                <div
                  className={`px-4 py-3 rounded text-body-md leading-relaxed ${
                    isAssistant
                      ? 'surface-raised text-ink-900'
                      : 'bg-clay-500 text-cream-50'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            </div>
          )
        })}

        {messages.length === 1 && (
          <div className="pt-2">
            <p className="eyebrow mb-2">Try</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleSend(action)}
                  className="px-3 py-1.5 rounded surface-raised text-body-sm text-ink-700
                             border border-outline hover:border-moss-500 hover:text-moss-500 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="surface-inset rounded p-3 flex items-start gap-3 mt-4">
          <span className="material-symbols-outlined text-moss-500 text-[18px] mt-0.5">info</span>
          <p className="text-body-sm text-ink-700 text-pretty">
            If I can't resolve your request, I'll open a ticket and route it to a human operator automatically.
          </p>
        </div>

        {loading && (
          <div className="flex items-center gap-2 px-1">
            <span className="status-dot bg-moss-500 animate-pulse-soft" />
            <span className="eyebrow text-ink-500">Thinking…</span>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-outline-soft px-lg py-md bg-surface">
        <div className="relative">
          <textarea
            className="field resize-none pr-20"
            placeholder="Describe your issue…"
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute bottom-2 right-2 flex gap-1 items-center">
            <button className="btn btn-ghost p-1.5" aria-label="Attach">
              <span className="material-symbols-outlined text-[18px]">attach_file</span>
            </button>
            <button
              onClick={() => handleSend(input)}
              disabled={loading || !input.trim()}
              className="btn btn-primary p-1.5 disabled:opacity-40"
              aria-label="Send"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_upward</span>
            </button>
          </div>
        </div>
        <p className="eyebrow text-center mt-2 text-ink-500">⏎ to send · Shift ⏎ for newline</p>
      </div>
    </aside>
  )
}

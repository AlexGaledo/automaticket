import { useState } from 'react'
import { processAiQuery, createTicket } from '../services/api'

interface Message {
  role: 'assistant' | 'user'
  text: string
  isTicketNotice?: boolean
}

interface AIAssistantProps {
  onTicketCreated?: () => void
}

export default function AIAssistant({ onTicketCreated }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hi! I'm your AI assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const quickActions = [
    'Check status #TK-89025',
    'Optimize Flow Alpha',
    'Export report',
  ]

  async function handleSend(text: string) {
    const msg = text.trim()
    if (!msg || loading) return

    setMessages((prev) => [...prev, { role: 'user', text: msg }])
    setInput('')
    setLoading(true)

    try {
      const result = await processAiQuery(msg)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: result.response },
      ])

      if (result.should_escalate) {
        try {
          const subject = msg.length > 80 ? msg.slice(0, 80) + '...' : msg
          const ticket = await createTicket(subject, msg, 'High', 'Escalated')
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              text: `I couldn't fully resolve that. I've automatically created ticket ${ticket.id} on your behalf — our team will follow up shortly.`,
              isTicketNotice: true,
            },
          ])
          onTicketCreated?.()
        } catch {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', text: 'I tried to open a ticket on your behalf but the request failed. Please try again.' },
          ])
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Sorry, I encountered an error. Please try again.' },
      ])
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

  return (
    <aside className="fixed right-0 top-0 h-screen w-[360px] bg-surface-container-lowest border-l border-outline-variant z-50 flex flex-col">
      <div className="p-lg border-b border-outline-variant flex items-center gap-md bg-primary-container text-on-primary">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
        </div>
        <div>
          <h4 className="font-bold font-sans text-[18px]">AI Assistant</h4>
          <div className="flex items-center gap-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span className="text-label-sm opacity-80 uppercase tracking-tighter">Active Now</span>
          </div>
        </div>
      </div>

      <div className="flex-grow p-lg overflow-y-auto bg-surface-container-low/30 space-y-lg">
        {messages.map((m, i) => (
          <div key={i}>
            <div
              className={`p-lg rounded-xl border shadow-sm text-on-surface-variant font-body-md max-w-[90%] ${
                m.isTicketNotice
                  ? 'rounded-tl-none bg-error/5 border-error/30 text-on-surface'
                  : m.role === 'assistant'
                  ? 'rounded-tl-none bg-white border-outline-variant'
                  : 'rounded-br-none bg-primary-fixed ml-auto border-outline-variant'
              }`}
            >
              {m.isTicketNotice && (
                <div className="flex items-center gap-sm mb-xs text-error font-label-md">
                  <span className="material-symbols-outlined text-[18px]">add_task</span>
                  Ticket Created
                </div>
              )}
              {m.text}
            </div>
            <span className="text-[10px] text-secondary mt-xs block ml-xs font-label-md uppercase">
              {m.role === 'assistant' ? 'Assistant' : 'You'} • Just Now
            </span>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-sm">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                className="bg-white border border-outline-variant px-md py-sm rounded-full text-body-sm hover:border-primary hover:text-primary transition-all"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        <div className="p-md bg-surface-container rounded-lg border border-outline-variant flex items-center gap-md">
          <span className="material-symbols-outlined text-primary">info</span>
          <p className="text-body-sm text-secondary">If I can't resolve your issue, I'll automatically open a ticket so our team can step in.</p>
        </div>
      </div>

      <div className="p-lg border-t border-outline-variant bg-white">
        <div className="relative">
          <textarea
            className="w-full border border-outline-variant rounded-xl p-md text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder:text-outline-variant outline-none"
            placeholder="Describe your issue or ask a question..."
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute bottom-3 right-3 flex gap-sm">
            <button className="p-sm text-secondary hover:text-primary transition-colors">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <button
              onClick={() => handleSend(input)}
              disabled={loading || !input.trim()}
              className="bg-primary text-on-primary p-sm rounded-lg shadow-md active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </button>
          </div>
        </div>
        <p className="text-center text-[11px] text-outline mt-md font-label-md">Powered by AutoTicket Core AI v2.4</p>
      </div>
    </aside>
  )
}

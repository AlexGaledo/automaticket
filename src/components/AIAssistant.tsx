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

  if (variant === 'page') {
    return (
      <div className="flex flex-col h-full rounded-xl border border-slate-200 dark:border-slate-700 shadow-card bg-white dark:bg-slate-800 overflow-hidden theme-dark">
        <div className="p-lg border-b border-slate-200 dark:border-slate-700 flex items-center gap-md bg-gradient-to-r from-indigo-50 to-indigo-50/80 dark:from-indigo-950/30 dark:to-indigo-950/20">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-600">
            <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          </div>
          <div>
            <h4 className="font-bold font-sans text-[18px] text-slate-900 dark:text-slate-100">AI Assistant</h4>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-tighter font-semibold">Active Now</span>
            </div>
          </div>
        </div>

        <div className="flex-grow p-lg overflow-y-auto bg-slate-50/40 dark:bg-slate-900/30 space-y-lg scrollbar-thin">
          {messages.map((m, i) => (
            <div key={i} className="animate-fade-in-fast" style={{ animationDelay: `${i * 0.05}s` }}>
              <div
                className={`p-lg rounded-xl border shadow-sm font-body-md text-[15px] leading-relaxed max-w-[90%] theme-dark ${
                  m.isTicketNotice
                    ? 'rounded-tl-none bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-slate-800 dark:text-slate-200'
                    : m.role === 'assistant'
                    ? 'rounded-tl-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    : 'rounded-br-none bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-800 ml-auto text-slate-800 dark:text-slate-200'
                }`}
              >
                {m.isTicketNotice && (
                  <div className="flex items-center gap-sm mb-xs text-red-600 dark:text-red-400 text-sm font-semibold">
                    <span className="material-symbols-outlined text-[18px]">add_task</span>
                    Ticket Created
                  </div>
                )}
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block ml-1 font-medium uppercase tracking-wider">
                {m.role === 'assistant' ? 'Assistant' : 'You'} &bull; Just Now
              </span>
            </div>
          ))}

          {messages.length === 1 && (
            <div className="flex flex-wrap gap-sm">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => handleSend(action)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-md py-sm rounded-full text-sm text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:shadow-sm"
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          <div className="p-md bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-md theme-dark">
            <span className="material-symbols-outlined text-indigo-500 dark:text-indigo-400 text-[20px]">info</span>
            <p className="text-sm text-slate-500 dark:text-slate-400">If I can't resolve your issue, I'll automatically open a ticket so our team can step in.</p>
          </div>
        </div>

        <div className="p-lg border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 theme-dark">
          <div className="relative">
            <textarea
              className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-md text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none placeholder:text-slate-300 dark:placeholder:text-slate-500 outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 theme-dark"
              placeholder="Describe your issue or ask a question..."
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="absolute bottom-3 right-3 flex gap-sm">
              <button className="p-sm text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <button
                onClick={() => handleSend(input)}
                disabled={loading || !input.trim()}
                className="bg-indigo-600 text-white p-sm rounded-lg shadow-sm active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 hover:bg-indigo-700"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-3 font-medium">Powered by Automaticket Core AI v2.4</p>
        </div>
      </div>
    )
  }

  return (
    <aside className="fixed right-0 top-0 h-screen w-[360px] bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 z-50 flex flex-col shadow-elevated theme-dark">
      <div className="p-lg border-b border-slate-200 dark:border-slate-700 flex items-center gap-md bg-gradient-to-r from-indigo-50 to-indigo-50/80 dark:from-indigo-950/30 dark:to-indigo-950/20">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-600">
          <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
        </div>
        <div>
          <h4 className="font-bold font-sans text-[18px] text-slate-900 dark:text-slate-100">AI Assistant</h4>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-tighter font-semibold">Active Now</span>
          </div>
        </div>
      </div>

      <div className="flex-grow p-lg overflow-y-auto bg-slate-50/40 dark:bg-slate-900/30 space-y-lg scrollbar-thin">
        {messages.map((m, i) => (
          <div key={i}>
            <div
              className={`p-lg rounded-xl border shadow-sm font-body-md text-[15px] leading-relaxed max-w-[90%] theme-dark ${
                m.isTicketNotice
                  ? 'rounded-tl-none bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-slate-800 dark:text-slate-200'
                  : m.role === 'assistant'
                  ? 'rounded-tl-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  : 'rounded-br-none bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-800 ml-auto text-slate-800 dark:text-slate-200'
              }`}
            >
              {m.isTicketNotice && (
                <div className="flex items-center gap-sm mb-xs text-red-600 dark:text-red-400 text-sm font-semibold">
                  <span className="material-symbols-outlined text-[18px]">add_task</span>
                  Ticket Created
                </div>
              )}
              {m.text}
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block ml-1 font-medium uppercase tracking-wider">
              {m.role === 'assistant' ? 'Assistant' : 'You'} &bull; Just Now
            </span>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="flex flex-wrap gap-sm">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-md py-sm rounded-full text-sm text-slate-600 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:shadow-sm"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        <div className="p-md bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-md theme-dark">
          <span className="material-symbols-outlined text-indigo-500 dark:text-indigo-400 text-[20px]">info</span>
          <p className="text-sm text-slate-500 dark:text-slate-400">If I can't resolve your issue, I'll automatically open a ticket so our team can step in.</p>
        </div>
      </div>

      <div className="p-lg border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 theme-dark">
        <div className="relative">
          <textarea
            className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-md text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none placeholder:text-slate-300 dark:placeholder:text-slate-500 outline-none bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 theme-dark"
            placeholder="Describe your issue or ask a question..."
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute bottom-3 right-3 flex gap-sm">
            <button className="p-sm text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <button
              onClick={() => handleSend(input)}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 text-white p-sm rounded-lg shadow-sm active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 hover:bg-indigo-700"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-3 font-medium">Powered by Automaticket Core AI v2.4</p>
      </div>
    </aside>
  )
}

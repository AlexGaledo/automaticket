import { useEffect, useState } from 'react'
import { getKnowledge, updateKnowledge } from '../services/api'

function renderMarkdown(md: string): string {
  let html = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const lines = html.split('\n')
  const out: string[] = []
  let inCodeBlock = false
  let codeBuf: string[] = []

  const inline = (s: string) => s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="font-mono text-mono-sm bg-outline-soft px-1.5 py-0.5 rounded">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-clay-500 underline underline-offset-2">$1</a>')

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCodeBlock) { out.push(`<pre class="bg-outline-soft p-3 rounded font-mono text-mono-sm overflow-x-auto"><code>${codeBuf.join('\n')}</code></pre>`); codeBuf = [] }
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) { codeBuf.push(line); continue }

    if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^(#+)/)![1].length
      const text = line.replace(/^#+\s+/, '')
      const sizes = ['', 'text-headline-lg display', 'text-headline-md display', 'text-headline-sm', 'text-body-lg font-semibold']
      out.push(`<h${level} class="${sizes[Math.min(level,4)]} text-ink-900 mt-6 mb-2">${inline(text)}</h${level}>`)
      continue
    }
    if (/^>\s/.test(line)) {
      out.push(`<blockquote class="border-l-2 border-clay-500 pl-3 italic text-ink-700 my-2 display">${inline(line.replace(/^>\s+/, ''))}</blockquote>`)
      continue
    }
    if (/^- /.test(line)) {
      out.push(`<li class="ml-4 list-disc text-ink-700">${inline(line.replace(/^- /, ''))}</li>`)
      continue
    }
    if (/^\d+\. /.test(line)) {
      out.push(`<li class="ml-4 list-decimal text-ink-700">${inline(line.replace(/^\d+\. /, ''))}</li>`)
      continue
    }
    if (line.trim() === '') { out.push(''); continue }
    out.push(`<p class="text-body-md text-ink-700 leading-relaxed">${inline(line)}</p>`)
  }
  if (inCodeBlock) out.push(`<pre><code>${codeBuf.join('\n')}</code></pre>`)
  return out.join('\n')
}

export default function KnowledgeEditor() {
  const [content, setContent] = useState('')
  const [savedContent, setSavedContent] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    getKnowledge()
      .then((res) => { setContent(res.content); setSavedContent(res.content); setUpdatedAt(res.updated_at) })
      .catch(() => setMessage({ type: 'error', text: 'Failed to load knowledge base.' }))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true); setMessage(null)
    try {
      const res = await updateKnowledge(content)
      setSavedContent(res.content); setUpdatedAt(res.updated_at)
      setMessage({ type: 'success', text: 'Saved.' })
    } catch { setMessage({ type: 'error', text: 'Save failed.' }) }
    finally { setSaving(false) }
  }

  const hasChanges = content !== savedContent

  const placeholder = `# Company Knowledge Base

Write your company context, common issues, and solutions here.
This content is injected into the AI's system prompt.

## Suggested sections

- **Company overview** — what your business does
- **Common issues** — frequent problems and their solutions
- **Escalation criteria** — when to escalate vs resolve

> Payment gateway timeouts during peak hours should be
> routed through the backup provider.
`

  return (
    <section className="card overflow-hidden">
      <header className="px-lg py-md border-b border-outline flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="eyebrow">Source · System prompt</span>
          <h2 className="display text-headline-md text-ink-900 mt-1">Knowledge base</h2>
          <p className="text-body-sm text-ink-500 mt-0.5">Markdown injected into the assistant on every query.</p>
        </div>
        <div className="flex items-center gap-2">
          {updatedAt && (
            <span className="font-mono text-mono-xs text-ink-500 hidden md:inline tabular">
              Saved {new Date(updatedAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
            </span>
          )}
          <button
            onClick={() => setPreview(!preview)}
            className={`btn text-xs px-3 py-1.5 ${preview ? 'btn-secondary' : 'btn-ghost border border-outline'}`}
          >
            {preview ? '✎ Edit' : '⊙ Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges || loading}
            className="btn btn-primary text-xs px-4 py-1.5 disabled:opacity-40"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </header>

      {message && (
        <div className={`px-lg py-2 text-body-sm border-b border-outline-soft ${
          message.type === 'success'
            ? 'bg-moss-50 text-moss-700 dark:bg-moss-800/30 dark:text-moss-100'
            : 'bg-brick-50 text-brick-700 dark:bg-brick-700/20 dark:text-brick-100'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-outline">
        <div className={preview ? 'hidden sm:block' : ''}>
          <div className="px-lg py-2 border-b border-outline-soft">
            <span className="eyebrow">Markdown</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            spellCheck={false}
            className="w-full h-[520px] px-lg py-md font-mono text-mono-sm text-ink-900 bg-surface
                       resize-none focus:outline-none placeholder:text-ink-300"
          />
        </div>
        <div className={!preview ? 'hidden sm:block' : ''}>
          <div className="px-lg py-2 border-b border-outline-soft">
            <span className="eyebrow">{content.trim() ? 'Preview' : 'Preview — start typing'}</span>
          </div>
          <div
            className="h-[520px] overflow-y-auto px-lg py-md scrollbar-thin"
            dangerouslySetInnerHTML={{ __html: content.trim() ? renderMarkdown(content) : '' }}
          />
        </div>
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { getKnowledge, updateKnowledge } from '../services/api'

function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const lines = html.split('\n')
  const out: string[] = []
  let inCodeBlock = false
  let codeBuf: string[] = []

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        out.push(`<pre><code>${codeBuf.join('\n')}</code></pre>`)
        codeBuf = []
      }
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) {
      codeBuf.push(line)
      continue
    }

    let processed = line

    if (/^#{1,6}\s/.test(processed)) {
      const level = processed.match(/^(#+)/)![1].length
      const text = processed.replace(/^#+\s+/, '')
      out.push(`<h${level}>${text}</h${level}>`)
      continue
    }

    if (/^>\s/.test(processed)) {
      processed = processed.replace(/^>\s+/, '')
      processed = processed.replace(
        /\*\*(.+?)\*\*/g, '<strong>$1</strong>'
      ).replace(
        /\*(.+?)\*/g, '<em>$1</em>'
      ).replace(
        /`(.+?)`/g, '<code>$1</code>'
      ).replace(
        /\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-indigo-600 dark:text-indigo-400 underline">$1</a>'
      )
      out.push(`<blockquote class="border-l-4 border-slate-300 dark:border-slate-600 pl-3 italic text-slate-600 dark:text-slate-400">${processed}</blockquote>`)
      continue
    }

    if (/^- /.test(processed)) {
      processed = processed.replace(/^- /, '')
      processed = processed.replace(
        /\*\*(.+?)\*\*/g, '<strong>$1</strong>'
      ).replace(
        /\*(.+?)\*/g, '<em>$1</em>'
      ).replace(
        /`(.+?)`/g, '<code>$1</code>'
      ).replace(
        /\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-indigo-600 dark:text-indigo-400 underline">$1</a>'
      )
      out.push(`<li class="ml-4 list-disc">${processed}</li>`)
      continue
    }

    if (/^\d+\. /.test(processed)) {
      processed = processed.replace(/^\d+\. /, '')
      processed = processed.replace(
        /\*\*(.+?)\*\*/g, '<strong>$1</strong>'
      ).replace(
        /\*(.+?)\*/g, '<em>$1</em>'
      ).replace(
        /`(.+?)`/g, '<code>$1</code>'
      ).replace(
        /\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-indigo-600 dark:text-indigo-400 underline">$1</a>'
      )
      out.push(`<li class="ml-4 list-decimal">${processed}</li>`)
      continue
    }

    processed = processed.replace(
      /\*\*(.+?)\*\*/g, '<strong>$1</strong>'
    ).replace(
      /\*(.+?)\*/g, '<em>$1</em>'
    ).replace(
      /`(.+?)`/g, '<code>$1</code>'
    ).replace(
      /\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-indigo-600 dark:text-indigo-400 underline">$1</a>'
    )

    if (processed.trim() === '') {
      out.push('')
    } else {
      out.push(`<p class="text-body-lg text-slate-700 dark:text-slate-300">${processed}</p>`)
    }
  }

  if (inCodeBlock) {
    out.push(`<pre><code>${codeBuf.join('\n')}</code></pre>`)
  }

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
      .then((res) => {
        setContent(res.content)
        setSavedContent(res.content)
        setUpdatedAt(res.updated_at)
      })
      .catch(() => {
        setMessage({ type: 'error', text: 'Failed to load knowledge base.' })
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const res = await updateKnowledge(content)
      setSavedContent(res.content)
      setUpdatedAt(res.updated_at)
      setMessage({ type: 'success', text: 'Knowledge base saved.' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to save.' })
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = content !== savedContent

  const placeholder = `# Company Knowledge Base

Write your company context, common issues, and solutions here.
This content is injected into the AI's system prompt so it
understands your business.

## Suggested sections

- **Company overview** — what your business does
- **Common issues** — frequent problems and their solutions
- **Escalation criteria** — when to escalate vs resolve
- **Known workarounds** — step-by-step fixes for recurring bugs

### Example:

> Payment gateway timeouts during peak hours should be
> resolved by routing through the backup provider.

For technical issues, check \`/var/log/app/error.log\`.
`

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-card overflow-hidden theme-dark">
      <div className="p-lg border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-indigo-50/60 to-violet-50/60 dark:from-indigo-950/30 dark:to-violet-950/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-slate-900 dark:text-slate-100">Knowledge Base</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Write context & rulebook — this is injected into the AI's system prompt
            </p>
          </div>
          <div className="flex items-center gap-2">
            {updatedAt && (
              <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                Last saved {new Date(updatedAt).toLocaleString()}
              </span>
            )}
            <button
              onClick={() => setPreview(!preview)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                preview
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-700'
                  : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'
              }`}
            >
              {preview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                hasChanges && !saving
                  ? 'brand-gradient text-white shadow-sm hover:opacity-90 active:scale-95'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`px-lg py-2 text-sm ${
          message.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
            : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400'
        }`}>
          {message.type === 'success' ? (
            <span className="material-symbols-outlined text-[16px] align-text-bottom mr-1">check_circle</span>
          ) : (
            <span className="material-symbols-outlined text-[16px] align-text-bottom mr-1">error</span>
          )}
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row">
        <div className={`${preview ? 'hidden sm:block' : ''} sm:w-1/2 border-r-0 sm:border-r border-slate-200 dark:border-slate-700`}>
          <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Markdown</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full h-[500px] p-lg font-mono text-sm text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 resize-none focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
          />
        </div>

        <div className={`${!preview ? 'hidden sm:block' : ''} sm:w-1/2`}>
          <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {content.trim() ? 'Preview' : 'Preview — start typing above'}
            </span>
          </div>
          <div
            className="h-[500px] overflow-y-auto p-lg prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content.trim() ? renderMarkdown(content) : '' }}
          />
        </div>
      </div>

      <div className="px-lg py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          <span className="material-symbols-outlined text-[14px] align-text-bottom">info</span>
          This content is injected into the AI system prompt on every query. Write in Markdown format.
        </p>
      </div>
    </div>
  )
}

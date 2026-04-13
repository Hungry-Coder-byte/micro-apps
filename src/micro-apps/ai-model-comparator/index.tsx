'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useClipboard } from '@/hooks/useClipboard'
import { Sparkles, Square, Copy, Check, X, Plus } from 'lucide-react'
import { MarkdownOutput } from '@/components/markdown-output'

const ALL_MODELS = [
  'gemma3:latest', 'gemma:latest', 'mistral:latest', 'mistral-small3.1',
  'llama3:latest', 'codellama', 'crewai-llama3',
]

interface ModelResult {
  model: string
  output: string
  loading: boolean
  error: string
  startTime?: number
  elapsed?: number
}

async function streamOllama(
  model: string,
  prompt: string,
  system: string,
  signal: AbortSignal,
  onChunk: (text: string) => void,
  onDone: (elapsed: number) => void,
  onError: (err: string) => void,
) {
  const start = Date.now()
  try {
    const res = await fetch('/api/proxy/ollama', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, system }),
      signal,
    })
    if (!res.ok) {
      const j = await res.json() as { error?: string }
      onError(j.error ?? `Failed (${res.status})`)
      return
    }
    const reader = res.body!.getReader()
    const decoder = new TextDecoder()
    let text = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      text += decoder.decode(value, { stream: true })
      onChunk(text)
    }
    onDone(Date.now() - start)
  } catch (e) {
    if ((e as Error).name !== 'AbortError') onError((e as Error).message)
    else onDone(Date.now() - start)
  }
}

export default function AiModelComparator() {
  const [prompt, setPrompt] = useState('')
  const [system, setSystem] = useState('')
  const [selected, setSelected] = useState<string[]>(['gemma3:latest', 'mistral:latest'])
  const [results, setResults] = useState<ModelResult[]>([])
  const [running, setRunning] = useState(false)
  const [aborts] = useState<Map<string, AbortController>>(new Map())
  const { copy, copied } = useClipboard()

  const toggleModel = (m: string) => {
    setSelected(prev =>
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    )
  }

  const updateResult = useCallback((model: string, patch: Partial<ModelResult>) => {
    setResults(prev => prev.map(r => r.model === model ? { ...r, ...patch } : r))
  }, [])

  async function runAll() {
    if (!prompt.trim() || selected.length === 0) return
    setRunning(true)

    const initial: ModelResult[] = selected.map(m => ({
      model: m, output: '', loading: true, error: '', startTime: Date.now(),
    }))
    setResults(initial)

    await Promise.all(selected.map(async model => {
      const ac = new AbortController()
      aborts.set(model, ac)
      await streamOllama(
        model, prompt.trim(), system.trim(), ac.signal,
        text => updateResult(model, { output: text }),
        elapsed => updateResult(model, { loading: false, elapsed }),
        err => updateResult(model, { loading: false, error: err }),
      )
      aborts.delete(model)
    }))

    setRunning(false)
  }

  function stopAll() {
    aborts.forEach(ac => ac.abort())
    aborts.clear()
    setResults(prev => prev.map(r => ({ ...r, loading: false })))
    setRunning(false)
  }

  function reset() {
    stopAll()
    setResults([])
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">

      {/* Model picker */}
      <div>
        <Label className="text-xs mb-2 block">Select models to compare (pick 2–4)</Label>
        <div className="flex flex-wrap gap-2">
          {ALL_MODELS.map(m => (
            <button
              key={m}
              onClick={() => toggleModel(m)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-mono ${
                selected.includes(m)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:border-primary/60 text-muted-foreground'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* System prompt (optional) */}
      <div>
        <Label className="text-xs mb-1.5 block">System prompt (optional)</Label>
        <Textarea
          placeholder="e.g. You are a senior software engineer. Be concise."
          value={system}
          onChange={e => setSystem(e.target.value)}
          rows={2}
          className="text-sm resize-none"
        />
      </div>

      {/* User prompt */}
      <div>
        <Label className="text-xs mb-1.5 block">Prompt *</Label>
        <Textarea
          placeholder="Enter the prompt you want to test across all selected models…"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
          className="text-sm resize-none"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={runAll}
          disabled={running || !prompt.trim() || selected.length < 1}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {running ? `Running ${selected.length} models…` : `Compare ${selected.length} Models`}
        </Button>
        {running && (
          <Button variant="outline" onClick={stopAll} className="gap-1.5">
            <Square className="h-3.5 w-3.5" /> Stop All
          </Button>
        )}
        {results.length > 0 && !running && (
          <Button variant="ghost" onClick={reset} className="gap-1.5 text-xs">
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
        )}
      </div>

      {/* Results grid */}
      {results.length > 0 && (
        <div className={`grid gap-4 ${results.length === 1 ? 'grid-cols-1' : results.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
          {results.map(r => (
            <div key={r.model} className="rounded-xl border bg-muted/30 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">{r.model}</Badge>
                  {r.loading && (
                    <span className="text-xs text-muted-foreground animate-pulse">generating…</span>
                  )}
                  {!r.loading && r.elapsed && (
                    <span className="text-xs text-muted-foreground">{(r.elapsed / 1000).toFixed(1)}s</span>
                  )}
                </div>
                {r.output && (
                  <Button size="sm" variant="ghost" onClick={() => copy(r.output)} className="h-6 gap-1 text-xs">
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                )}
              </div>
              <div className="p-3 flex-1 min-h-[120px]">
                {r.error && <span className="text-destructive text-xs">{r.error}</span>}
                {!r.error && !r.output && r.loading && (
                  <span className="text-muted-foreground text-xs">Waiting for response…</span>
                )}
                {r.output && <MarkdownOutput content={r.output} />}
                {r.loading && <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

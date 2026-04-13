'use client'

import { useState } from 'react'
import { useOllama } from '@/hooks/useOllama'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useClipboard } from '@/hooks/useClipboard'
import { Sparkles, Square, Copy, Check, RotateCcw, Bug } from 'lucide-react'
import { MarkdownOutput } from '@/components/markdown-output'

const DEV_MODELS = ['codellama', 'mistral:latest', 'mistral-small3.1', 'llama3:latest', 'gemma3:latest']

const SYSTEM = `You are an expert software debugger. When given a stack trace:
1. Explain in plain English what went wrong (not developer jargon)
2. Identify the root cause — the actual line/function where the bug originates
3. Explain why this error happens
4. Provide a concrete code fix or steps to resolve it

Structure your response:
## What Happened
## Root Cause
## How to Fix
## Code Fix (if applicable)`

const EXAMPLE = `Error: Cannot read properties of undefined (reading 'map')
    at ProductList (/src/components/ProductList.tsx:23:28)
    at renderWithHooks (react-dom.development.js:16141)
    at mountIndeterminateComponent (react-dom.development.js:20838)
    at beginWork (react-dom.development.js:21981)
    at HTMLUnknownElement.callCallback (react-dom.development.js:4156)
    at Object.invokeGuardedCallbackDev (react-dom.development.js:4205)
    at invokeGuardedCallback (react-dom.development.js:4270)`

export default function AiStackTrace() {
  const [trace, setTrace] = useState('')
  const [lang, setLang] = useState('auto')
  const [model, setModel] = useState('codellama')
  const { output, loading, error, run, stop, reset } = useOllama({ model, system: SYSTEM })
  const { copy, copied } = useClipboard()

  function handleRun() {
    if (!trace.trim()) return
    const langHint = lang !== 'auto' ? ` (${lang} codebase)` : ''
    run(`Explain this stack trace${langHint} and tell me how to fix it:\n\n\`\`\`\n${trace.trim()}\n\`\`\``)
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-40">
          <Label className="text-xs mb-1.5 block">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DEV_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-40">
          <Label className="text-xs mb-1.5 block">Language / Framework</Label>
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto-detect</SelectItem>
              <SelectItem value="JavaScript / TypeScript">JavaScript / TypeScript</SelectItem>
              <SelectItem value="Python">Python</SelectItem>
              <SelectItem value="Java">Java</SelectItem>
              <SelectItem value="Go">Go</SelectItem>
              <SelectItem value="Rust">Rust</SelectItem>
              <SelectItem value="C# / .NET">C# / .NET</SelectItem>
              <SelectItem value="PHP">PHP</SelectItem>
              <SelectItem value="Ruby">Ruby</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-xs">Stack trace</Label>
          <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setTrace(EXAMPLE)}>
            Load example
          </Button>
        </div>
        <Textarea
          placeholder="Paste your stack trace here…"
          value={trace}
          onChange={e => setTrace(e.target.value)}
          rows={8}
          className="font-mono text-xs resize-none"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleRun} disabled={loading || !trace.trim()} className="gap-2">
          <Bug className="h-4 w-4" />
          {loading ? 'Analyzing…' : 'Explain Stack Trace'}
        </Button>
        {loading && (
          <Button variant="outline" onClick={stop} className="gap-1.5">
            <Square className="h-3.5 w-3.5" /> Stop
          </Button>
        )}
        {(output || error) && !loading && (
          <Button variant="ghost" size="icon" onClick={() => { reset(); setTrace('') }}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}

      {(output || loading) && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium">Explanation</span>
              <Badge variant="outline" className="text-xs">{model}</Badge>
            </div>
            {output && (
              <Button size="sm" variant="ghost" onClick={() => copy(output)} className="h-7 gap-1.5 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>
          <div className="min-h-[60px]">
            <MarkdownOutput content={output} />
            {loading && <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />}
          </div>
        </div>
      )}
    </div>
  )
}

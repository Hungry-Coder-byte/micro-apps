'use client'

import { useState } from 'react'
import { useOllama } from '@/hooks/useOllama'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useClipboard } from '@/hooks/useClipboard'
import { Sparkles, Square, Copy, Check, RotateCcw, AlertTriangle } from 'lucide-react'
import { MarkdownOutput } from '@/components/markdown-output'

const DEV_MODELS = ['mistral:latest', 'mistral-small3.1', 'gemma3:latest', 'llama3:latest', 'codellama']

const SYSTEM = `You are an expert DevOps engineer and log analyst.
When given application logs:
1. Identify errors, warnings, and anomalies
2. Explain what caused each issue in plain English
3. Point out the most critical problem first
4. Suggest concrete fixes
Format your response with clear sections: ## Summary, ## Issues Found, ## Root Cause, ## Suggested Fixes`

const EXAMPLES = {
  node: `[2024-01-15 09:23:41] INFO  Server started on port 3000
[2024-01-15 09:24:05] ERROR TypeError: Cannot read property 'id' of undefined
    at getUserById (/app/routes/users.js:42:25)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
[2024-01-15 09:24:05] WARN  Database connection pool exhausted (pool size: 10)
[2024-01-15 09:24:06] ERROR MongoNetworkError: connection timed out after 30000ms`,
  nginx: `192.168.1.1 - - [15/Jan/2024:09:23:41 +0000] "GET /api/users HTTP/1.1" 200 1234
192.168.1.2 - - [15/Jan/2024:09:23:42 +0000] "POST /api/login HTTP/1.1" 500 89
192.168.1.3 - - [15/Jan/2024:09:23:43 +0000] "GET /api/data HTTP/1.1" 504 0
2024/01/15 09:23:44 [error] 1234#0: *5 connect() failed (111: Connection refused) while connecting to upstream`,
}

export default function AiLogAnalyzer() {
  const [logs, setLogs] = useState('')
  const [model, setModel] = useState('mistral:latest')
  const { output, loading, error, run, stop, reset } = useOllama({ model, system: SYSTEM })
  const { copy, copied } = useClipboard()

  function handleRun() {
    if (!logs.trim()) return
    run(`Analyze these logs and identify all issues:\n\n\`\`\`\n${logs.trim()}\n\`\`\``)
  }

  const lineCount = logs.trim() ? logs.trim().split('\n').length : 0

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48">
          <Label className="text-xs mb-1.5 block">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DEV_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setLogs(EXAMPLES.node)} className="text-xs">
            Load Node.js example
          </Button>
          <Button variant="outline" size="sm" onClick={() => setLogs(EXAMPLES.nginx)} className="text-xs">
            Load Nginx example
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-xs">Paste your logs</Label>
          {lineCount > 0 && <span className="text-xs text-muted-foreground">{lineCount} lines</span>}
        </div>
        <Textarea
          placeholder="Paste application logs, error logs, server logs…"
          value={logs}
          onChange={e => setLogs(e.target.value)}
          rows={10}
          className="font-mono text-xs resize-none"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleRun} disabled={loading || !logs.trim()} className="gap-2">
          <AlertTriangle className="h-4 w-4" />
          {loading ? 'Analyzing…' : 'Analyze Logs'}
        </Button>
        {loading && (
          <Button variant="outline" onClick={stop} className="gap-1.5">
            <Square className="h-3.5 w-3.5" /> Stop
          </Button>
        )}
        {(output || error) && !loading && (
          <Button variant="ghost" size="icon" onClick={() => { reset(); setLogs('') }}>
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
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Analysis</span>
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

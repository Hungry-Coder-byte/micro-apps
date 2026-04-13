'use client'

import { useState } from 'react'
import { useOllama } from '@/hooks/useOllama'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useClipboard } from '@/hooks/useClipboard'
import { Wrench, Square, Copy, Check, RotateCcw } from 'lucide-react'
import { MarkdownOutput } from '@/components/markdown-output'

const DEV_MODELS = ['codellama', 'mistral:latest', 'mistral-small3.1', 'llama3:latest', 'gemma3:latest']

const SYSTEM = `You are an expert debugger and senior software engineer.
When given an error message and optional code:
1. Explain what the error means in plain English
2. Identify the exact cause
3. Provide the fixed code with comments explaining what changed
4. Mention any related pitfalls to watch for

Format: ## Error Explanation, ## Root Cause, ## Fixed Code (use code blocks), ## Watch Out For`

export default function AiErrorFixer() {
  const [errorMsg, setErrorMsg] = useState('')
  const [code, setCode] = useState('')
  const [lang, setLang] = useState('typescript')
  const [model, setModel] = useState('codellama')
  const { output, loading, error, run, stop, reset } = useOllama({ model, system: SYSTEM })
  const { copy, copied } = useClipboard()

  function handleRun() {
    if (!errorMsg.trim()) return
    const codeBlock = code.trim()
      ? `\n\nRelevant code:\n\`\`\`${lang}\n${code.trim()}\n\`\`\``
      : ''
    run(`Fix this ${lang} error:\n\nError message:\n\`\`\`\n${errorMsg.trim()}\n\`\`\`${codeBlock}`)
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
          <Label className="text-xs mb-1.5 block">Language</Label>
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['typescript', 'javascript', 'python', 'java', 'go', 'rust', 'csharp', 'php', 'ruby', 'bash'].map(l => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="error">
        <TabsList className="h-8">
          <TabsTrigger value="error" className="text-xs">Error Message</TabsTrigger>
          <TabsTrigger value="code" className="text-xs">Code (optional)</TabsTrigger>
        </TabsList>
        <TabsContent value="error" className="mt-3">
          <Textarea
            placeholder="Paste the error message here…&#10;e.g. TypeError: Cannot read properties of null (reading 'addEventListener')"
            value={errorMsg}
            onChange={e => setErrorMsg(e.target.value)}
            rows={6}
            className="font-mono text-sm resize-none"
          />
        </TabsContent>
        <TabsContent value="code" className="mt-3">
          <Textarea
            placeholder={`Paste the relevant ${lang} code here (optional but improves results)…`}
            value={code}
            onChange={e => setCode(e.target.value)}
            rows={8}
            className="font-mono text-sm resize-none"
          />
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button onClick={handleRun} disabled={loading || !errorMsg.trim()} className="gap-2">
          <Wrench className="h-4 w-4" />
          {loading ? 'Fixing…' : 'Fix This Error'}
        </Button>
        {loading && (
          <Button variant="outline" onClick={stop} className="gap-1.5">
            <Square className="h-3.5 w-3.5" /> Stop
          </Button>
        )}
        {(output || error) && !loading && (
          <Button variant="ghost" size="icon" onClick={() => { reset(); setErrorMsg(''); setCode('') }}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}

      {(output || loading) && (
        <div className="rounded-xl border bg-muted/30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium">Fix Suggestion</span>
              <Badge variant="outline" className="text-xs">{model}</Badge>
              <Badge variant="secondary" className="text-xs">{lang}</Badge>
            </div>
            {output && (
              <Button size="sm" variant="ghost" onClick={() => copy(output)} className="h-7 gap-1.5 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>
          <div className="p-4 min-h-[60px]">
            <MarkdownOutput content={output} />
            {loading && <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />}
          </div>
        </div>
      )}
    </div>
  )
}

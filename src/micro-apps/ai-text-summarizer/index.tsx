'use client'

import { useState } from 'react'
import { useOllama } from '@/hooks/useOllama'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useClipboard } from '@/hooks/useClipboard'
import { Sparkles, Square, Copy, Check, RotateCcw } from 'lucide-react'
import { MarkdownOutput } from '@/components/markdown-output'

const TEXT_MODELS = ['gemma3:latest', 'gemma:latest', 'mistral:latest', 'mistral-small3.1', 'llama3:latest']

const MODES = [
  { value: 'brief',   label: 'Brief',        prompt: 'Summarize the following text in 2-3 concise sentences.' },
  { value: 'detailed', label: 'Detailed',    prompt: 'Provide a comprehensive summary of the following text with key points.' },
  { value: 'bullets', label: 'Bullet Points', prompt: 'Summarize the following text as a clean bullet-point list of the most important points.' },
  { value: 'eli5',    label: 'ELI5',         prompt: 'Explain the following text in very simple terms, as if explaining to a 10-year-old.' },
]

const SYSTEM = 'You are a precise text summarizer. Output only the summary — no preamble, no "Here is a summary:", just the result.'

export default function AiTextSummarizer() {
  const [text, setText] = useState('')
  const [model, setModel] = useState('gemma3:latest')
  const [mode, setMode] = useState('brief')
  const { output, loading, error, run, stop, reset } = useOllama({ model, system: SYSTEM })
  const { copy, copied } = useClipboard()

  const selectedMode = MODES.find(m => m.value === mode)!

  function handleRun() {
    if (!text.trim()) return
    run(`${selectedMode.prompt}\n\n---\n\n${text.trim()}`)
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-40">
          <Label className="text-xs mb-1.5 block">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEXT_MODELS.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-40">
          <Label className="text-xs mb-1.5 block">Style</Label>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODES.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-xs">Text to summarize</Label>
          {wordCount > 0 && (
            <span className="text-xs text-muted-foreground">{wordCount} words</span>
          )}
        </div>
        <Textarea
          placeholder="Paste any text here — articles, docs, meeting notes, emails..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={8}
          className="font-mono text-sm resize-none"
        />
      </div>

      {/* Action */}
      <div className="flex gap-2">
        <Button
          onClick={handleRun}
          disabled={loading || !text.trim()}
          className="gap-2 flex-1 sm:flex-none"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? 'Summarizing…' : 'Summarize'}
        </Button>
        {loading && (
          <Button variant="outline" onClick={stop} className="gap-1.5">
            <Square className="h-3.5 w-3.5" /> Stop
          </Button>
        )}
        {(output || error) && !loading && (
          <Button variant="ghost" size="icon" onClick={reset} title="Clear output">
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Output */}
      {(output || loading) && (
        <div className="rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs gap-1">
                <Sparkles className="h-3 w-3" /> {model}
              </Badge>
              <Badge variant="secondary" className="text-xs">{selectedMode.label}</Badge>
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

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
  {
    value: 'fix',
    label: 'Fix Only',
    system: 'You are a grammar corrector. Fix all grammar, spelling, and punctuation errors in the user\'s text. Return ONLY the corrected text with no explanation.',
    prompt: (t: string) => `Fix the grammar in this text:\n\n${t}`,
  },
  {
    value: 'explain',
    label: 'Fix + Explain',
    system: 'You are a grammar teacher. Fix the user\'s text and then explain each correction made.',
    prompt: (t: string) => `Fix the grammar in this text and explain each correction:\n\n${t}`,
  },
  {
    value: 'rewrite',
    label: 'Rewrite for Clarity',
    system: 'You are a professional editor. Rewrite the user\'s text to be clearer, more concise, and more professional while preserving the original meaning.',
    prompt: (t: string) => `Rewrite this text for clarity and professionalism:\n\n${t}`,
  },
  {
    value: 'tone-professional',
    label: 'Make Professional',
    system: 'You are a professional business writer. Transform the user\'s text into formal, professional business language.',
    prompt: (t: string) => `Rewrite this in a professional business tone:\n\n${t}`,
  },
]

export default function AiGrammarFixer() {
  const [text, setText] = useState('')
  const [model, setModel] = useState('gemma3:latest')
  const [mode, setMode] = useState('fix')
  const selectedMode = MODES.find(m => m.value === mode)!
  const { output, loading, error, run, stop, reset } = useOllama({ model, system: selectedMode.system })
  const { copy, copied } = useClipboard()

  function handleRun() {
    if (!text.trim()) return
    run(selectedMode.prompt(text.trim()))
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-40">
          <Label className="text-xs mb-1.5 block">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TEXT_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-40">
          <Label className="text-xs mb-1.5 block">Mode</Label>
          <Select value={mode} onValueChange={v => { setMode(v); reset() }}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MODES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs mb-1.5 block">Your text</Label>
          <Textarea
            placeholder="Paste text with grammar issues..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={10}
            className="text-sm resize-none h-full"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="text-xs">Result</Label>
            {output && (
              <Button size="sm" variant="ghost" onClick={() => copy(output)} className="h-6 gap-1 text-xs">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 min-h-[220px]">
            {error && <span className="text-destructive text-sm">{error}</span>}
            {!error && !output && !loading && (
              <span className="text-muted-foreground text-sm">Fixed text will appear here…</span>
            )}
            {output && <MarkdownOutput content={output} />}
            {loading && <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleRun} disabled={loading || !text.trim()} className="gap-2">
          <Sparkles className="h-4 w-4" />
          {loading ? 'Processing…' : selectedMode.label}
        </Button>
        {loading && (
          <Button variant="outline" onClick={stop} className="gap-1.5">
            <Square className="h-3.5 w-3.5" /> Stop
          </Button>
        )}
        {(output || error) && !loading && (
          <Button variant="ghost" size="icon" onClick={() => { reset(); setText('') }} title="Clear all">
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
        {output && (
          <Badge variant="outline" className="text-xs self-center ml-auto gap-1">
            <Sparkles className="h-3 w-3" /> {model}
          </Badge>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback } from 'react'
import { useOllama } from '@/hooks/useOllama'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useClipboard } from '@/hooks/useClipboard'
import { Sparkles, Square, Copy, Check, RotateCcw, FileText } from 'lucide-react'
import { MarkdownOutput } from '@/components/markdown-output'

const CODE_MODELS = ['codellama', 'gemma3:latest', 'mistral:latest', 'mistral-small3.1', 'llama3:latest']

const SYSTEM = `You are a technical writer specializing in open-source README files.
Generate clean, well-structured Markdown README files.
Use proper Markdown: headings, code blocks, badges, tables where helpful.
Output ONLY the Markdown content, no explanations.`

function ReadmeOutput({ output, loading, model, copy, copied }: {
  output: string; loading: boolean; model: string
  copy: (t: string) => void; copied: boolean
}) {
  const [tab, setTab] = useState<'preview' | 'raw'>('preview')
  return (
    <div className="rounded-xl border bg-muted/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium">README.md</span>
          <Badge variant="outline" className="text-xs">{model}</Badge>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTab('preview')}
            className={`text-xs px-2 py-1 rounded transition-colors ${tab === 'preview' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >Preview</button>
          <button
            onClick={() => setTab('raw')}
            className={`text-xs px-2 py-1 rounded transition-colors ${tab === 'raw' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >Raw</button>
          {output && (
            <Button size="sm" variant="ghost" onClick={() => copy(output)} className="h-7 gap-1.5 text-xs ml-1">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          )}
        </div>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {tab === 'preview' ? (
          <div className="p-4">
            <MarkdownOutput content={output} />
            {loading && <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />}
          </div>
        ) : (
          <pre className="p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed">
            {output}
            {loading && <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />}
          </pre>
        )}
      </div>
    </div>
  )
}

export default function AiReadmeGenerator() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [stack, setStack] = useState('')
  const [features, setFeatures] = useState('')
  const [model, setModel] = useState('codellama')
  const [style, setStyle] = useState('standard')
  const { output, loading, error, run, stop, reset } = useOllama({ model, system: SYSTEM })
  const { copy, copied } = useClipboard()

  function handleRun() {
    if (!name.trim() || !description.trim()) return
    const prompt = `Generate a ${style} README.md for a project with the following details:

Project Name: ${name}
Description: ${description}
Tech Stack: ${stack || 'Not specified'}
Key Features: ${features || 'Not specified'}

Include sections: Project title with badges, Description, Features, Tech Stack, Installation, Usage, Contributing, License.`

    run(prompt)
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-40">
          <Label className="text-xs mb-1.5 block">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CODE_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-40">
          <Label className="text-xs mb-1.5 block">Style</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs mb-1.5 block">Project Name *</Label>
          <Input placeholder="e.g. my-awesome-lib" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Tech Stack</Label>
          <Input placeholder="e.g. Next.js, TypeScript, Prisma" value={stack} onChange={e => setStack(e.target.value)} />
        </div>
      </div>

      <div>
        <Label className="text-xs mb-1.5 block">Description *</Label>
        <Textarea
          placeholder="What does this project do? Who is it for?"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="text-sm resize-none"
        />
      </div>

      <div>
        <Label className="text-xs mb-1.5 block">Key Features</Label>
        <Textarea
          placeholder="List the main features, one per line..."
          value={features}
          onChange={e => setFeatures(e.target.value)}
          rows={3}
          className="text-sm resize-none"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleRun}
          disabled={loading || !name.trim() || !description.trim()}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? 'Generating…' : 'Generate README'}
        </Button>
        {loading && (
          <Button variant="outline" onClick={stop} className="gap-1.5">
            <Square className="h-3.5 w-3.5" /> Stop
          </Button>
        )}
        {(output || error) && !loading && (
          <Button variant="ghost" size="icon" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
      )}

      {(output || loading) && (
        <ReadmeOutput output={output} loading={loading} model={model} copy={copy} copied={copied} />
      )}
    </div>
  )
}

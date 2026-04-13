'use client'

import { useState } from 'react'
import { useOllama } from '@/hooks/useOllama'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useClipboard } from '@/hooks/useClipboard'
import { Sparkles, Square, Copy, Check, RotateCcw, BarChart2 } from 'lucide-react'
import { MarkdownOutput } from '@/components/markdown-output'

const TEXT_MODELS = ['gemma3:latest', 'mistral:latest', 'mistral-small3.1', 'llama3:latest', 'gemma:latest']

const SYSTEM = `You are a data analyst. When given JSON data:
1. Summarize what this data represents
2. Identify key patterns, trends, or anomalies
3. Point out any data quality issues (nulls, inconsistencies, duplicates)
4. Give 3-5 actionable insights
5. Suggest what questions this data can and cannot answer

Be specific with numbers and field names from the data.`

const QUICK_QUESTIONS = [
  'What patterns do you see in this data?',
  'Are there any anomalies or outliers?',
  'What insights can I get from this?',
  'What data quality issues exist?',
  'Summarize this data in 5 bullet points',
]

const EXAMPLE_JSON = `{
  "sales": [
    { "month": "Jan", "revenue": 42000, "units": 320, "region": "North" },
    { "month": "Feb", "revenue": 38500, "units": 290, "region": "North" },
    { "month": "Mar", "revenue": 51200, "units": 410, "region": "North" },
    { "month": "Jan", "revenue": 29000, "units": 220, "region": "South" },
    { "month": "Feb", "revenue": null, "units": 180, "region": "South" },
    { "month": "Mar", "revenue": 33400, "units": 260, "region": "South" }
  ]
}`

export default function AiJsonInsights() {
  const [json, setJson] = useState('')
  const [question, setQuestion] = useState('')
  const [model, setModel] = useState('gemma3:latest')
  const { output, loading, error, run, stop, reset } = useOllama({ model, system: SYSTEM })
  const { copy, copied } = useClipboard()
  const [jsonError, setJsonError] = useState('')

  function validateAndRun() {
    setJsonError('')
    if (!json.trim()) return
    try {
      JSON.parse(json.trim())
    } catch {
      setJsonError('Invalid JSON — please check your input')
      return
    }
    const q = question.trim() || 'Analyze this JSON data and provide key insights.'
    run(`${q}\n\nJSON Data:\n\`\`\`json\n${json.trim()}\n\`\`\``)
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      <div className="flex flex-wrap gap-3">
        <div className="min-w-48">
          <Label className="text-xs mb-1.5 block">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {TEXT_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => { setJson(EXAMPLE_JSON); setJsonError('') }}>
            Load example
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-xs">JSON Data</Label>
          {jsonError && <span className="text-xs text-destructive">{jsonError}</span>}
        </div>
        <Textarea
          placeholder='{"data": [...]}'
          value={json}
          onChange={e => { setJson(e.target.value); setJsonError('') }}
          rows={10}
          className={`font-mono text-xs resize-none ${jsonError ? 'border-destructive' : ''}`}
        />
      </div>

      <div>
        <Label className="text-xs mb-1.5 block">Your question (optional)</Label>
        <Input
          placeholder="e.g. What trends do you see? Are there anomalies?"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {QUICK_QUESTIONS.map(q => (
            <button
              key={q}
              onClick={() => setQuestion(q)}
              className="text-xs px-2 py-1 rounded-md border hover:bg-muted transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={validateAndRun} disabled={loading || !json.trim()} className="gap-2">
          <BarChart2 className="h-4 w-4" />
          {loading ? 'Analyzing…' : 'Get Insights'}
        </Button>
        {loading && (
          <Button variant="outline" onClick={stop} className="gap-1.5">
            <Square className="h-3.5 w-3.5" /> Stop
          </Button>
        )}
        {(output || error) && !loading && (
          <Button variant="ghost" size="icon" onClick={() => { reset(); setJson(''); setQuestion('') }}>
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
              <BarChart2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Insights</span>
              <Badge variant="outline" className="text-xs gap-1">
                <Sparkles className="h-3 w-3" /> {model}
              </Badge>
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

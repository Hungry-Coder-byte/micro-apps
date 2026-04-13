'use client'

import { useState, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Hash, AlertTriangle } from 'lucide-react'

// Rough token estimators per model family
// GPT-style (tiktoken): ~4 chars per token
// LLaMA/Mistral: ~3.5-4 chars per token
// Code models: tend to be similar
const MODEL_CONFIGS: Record<string, {
  label: string
  charsPerToken: number
  contextWindow: number
  inputCostPer1k?: number
  outputCostPer1k?: number
  note?: string
}> = {
  'gemma3:latest':     { label: 'Gemma 3',        charsPerToken: 4,   contextWindow: 128000 },
  'gemma:latest':      { label: 'Gemma',           charsPerToken: 4,   contextWindow: 8192  },
  'mistral:latest':    { label: 'Mistral 7B',      charsPerToken: 3.8, contextWindow: 32768 },
  'mistral-small3.1':  { label: 'Mistral Small',   charsPerToken: 3.8, contextWindow: 32768 },
  'llama3:latest':     { label: 'LLaMA 3',         charsPerToken: 3.8, contextWindow: 8192  },
  'codellama':         { label: 'CodeLlama',       charsPerToken: 3.5, contextWindow: 16384 },
  'crewai-llama3':     { label: 'CrewAI LLaMA 3',  charsPerToken: 3.8, contextWindow: 8192  },
  // Cloud models for comparison
  'gpt-4o':            { label: 'GPT-4o',          charsPerToken: 4,   contextWindow: 128000, inputCostPer1k: 0.005,  outputCostPer1k: 0.015, note: 'OpenAI' },
  'gpt-4o-mini':       { label: 'GPT-4o Mini',     charsPerToken: 4,   contextWindow: 128000, inputCostPer1k: 0.00015, outputCostPer1k: 0.0006, note: 'OpenAI' },
  'claude-sonnet-4-6': { label: 'Claude Sonnet',   charsPerToken: 3.8, contextWindow: 200000, inputCostPer1k: 0.003,  outputCostPer1k: 0.015, note: 'Anthropic' },
  'claude-haiku':      { label: 'Claude Haiku',    charsPerToken: 3.8, contextWindow: 200000, inputCostPer1k: 0.00025, outputCostPer1k: 0.00125, note: 'Anthropic' },
}

function estimateTokens(text: string, charsPerToken: number): number {
  if (!text) return 0
  return Math.ceil(text.length / charsPerToken)
}

function formatNumber(n: number): string {
  return n.toLocaleString()
}

export default function AiTokenEstimator() {
  const [text, setText] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [model, setModel] = useState('gemma3:latest')
  const [expectedOutputTokens, setExpectedOutputTokens] = useState('500')

  const config = MODEL_CONFIGS[model]

  const stats = useMemo(() => {
    const inputTokens = estimateTokens(text, config.charsPerToken) + estimateTokens(systemPrompt, config.charsPerToken)
    const outputTokens = parseInt(expectedOutputTokens) || 0
    const totalTokens = inputTokens + outputTokens
    const contextUsedPct = Math.round((totalTokens / config.contextWindow) * 100)
    const remaining = config.contextWindow - inputTokens

    const inputCost = config.inputCostPer1k ? (inputTokens / 1000) * config.inputCostPer1k : null
    const outputCost = config.outputCostPer1k ? (outputTokens / 1000) * config.outputCostPer1k : null
    const totalCost = inputCost !== null && outputCost !== null ? inputCost + outputCost : null

    return { inputTokens, outputTokens, totalTokens, contextUsedPct, remaining, inputCost, outputCost, totalCost }
  }, [text, systemPrompt, model, expectedOutputTokens, config])

  const contextStatus = stats.contextUsedPct > 90 ? 'destructive' : stats.contextUsedPct > 70 ? 'warning' : 'ok'

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      {/* Model selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs mb-1.5 block">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1 text-xs text-muted-foreground font-semibold">Local (Ollama)</div>
              {Object.entries(MODEL_CONFIGS).filter(([, c]) => !c.note).map(([key, c]) => (
                <SelectItem key={key} value={key}>{c.label} — ctx {formatNumber(c.contextWindow)}</SelectItem>
              ))}
              <div className="px-2 py-1 text-xs text-muted-foreground font-semibold mt-1">Cloud (for comparison)</div>
              {Object.entries(MODEL_CONFIGS).filter(([, c]) => c.note).map(([key, c]) => (
                <SelectItem key={key} value={key}>{c.label} ({c.note})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Expected output tokens</Label>
          <Input
            type="number"
            min={0}
            value={expectedOutputTokens}
            onChange={e => setExpectedOutputTokens(e.target.value)}
            className="h-9"
            placeholder="500"
          />
        </div>
      </div>

      {/* System prompt */}
      <div>
        <Label className="text-xs mb-1.5 block">System prompt (optional)</Label>
        <Textarea
          placeholder="Your system prompt…"
          value={systemPrompt}
          onChange={e => setSystemPrompt(e.target.value)}
          rows={2}
          className="text-sm resize-none font-mono"
        />
      </div>

      {/* User text */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-xs">User message / content to estimate</Label>
          <span className="text-xs text-muted-foreground">{text.length.toLocaleString()} chars</span>
        </div>
        <Textarea
          placeholder="Paste your prompt, document, or any text to estimate its token count…"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={8}
          className="text-sm resize-none font-mono"
        />
      </div>

      {/* Stats */}
      <div className="rounded-xl border bg-muted/30 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Token Estimate</span>
          <Badge variant="outline" className="text-xs">{config.label}</Badge>
          {config.note && <Badge variant="secondary" className="text-xs">{config.note}</Badge>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Input tokens', value: formatNumber(stats.inputTokens), sub: 'prompt + system' },
            { label: 'Output tokens', value: formatNumber(stats.outputTokens), sub: 'estimated' },
            { label: 'Total tokens', value: formatNumber(stats.totalTokens), sub: 'input + output' },
            { label: 'Remaining ctx', value: formatNumber(stats.remaining), sub: `of ${formatNumber(config.contextWindow)}` },
          ].map(s => (
            <div key={s.label} className="rounded-lg border bg-background p-3 text-center">
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-xs font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Context window bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="text-muted-foreground">Context window usage</span>
            <span className={`font-semibold ${contextStatus === 'destructive' ? 'text-destructive' : contextStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'}`}>
              {stats.contextUsedPct}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${contextStatus === 'destructive' ? 'bg-destructive' : contextStatus === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(100, stats.contextUsedPct)}%` }}
            />
          </div>
          {contextStatus !== 'ok' && (
            <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1.5">
              <AlertTriangle className="h-3 w-3" />
              {contextStatus === 'destructive'
                ? 'Exceeding context window — reduce input size'
                : 'Approaching context limit — consider chunking'}
            </p>
          )}
        </div>

        {/* Cost estimate (cloud only) */}
        {stats.totalCost !== null && (
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs font-semibold mb-2">Estimated cost (cloud)</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-sm font-bold">${stats.inputCost!.toFixed(5)}</p>
                <p className="text-xs text-muted-foreground">Input cost</p>
              </div>
              <div>
                <p className="text-sm font-bold">${stats.outputCost!.toFixed(5)}</p>
                <p className="text-xs text-muted-foreground">Output cost</p>
              </div>
              <div>
                <p className="text-sm font-bold text-primary">${stats.totalCost.toFixed(5)}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">* Estimates only. Actual cost may vary.</p>
          </div>
        )}

        {config.note == null && (
          <p className="text-xs text-green-600 font-medium">✓ Local model — no API cost, runs on your machine</p>
        )}
      </div>
    </div>
  )
}

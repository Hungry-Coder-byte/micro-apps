'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DollarSign, TrendingDown, Zap, Server } from 'lucide-react'

const CLOUD_MODELS = [
  { id: 'gpt-4o',             label: 'GPT-4o',              provider: 'OpenAI',     inputPer1M: 5,      outputPer1M: 15,    contextK: 128 },
  { id: 'gpt-4o-mini',        label: 'GPT-4o Mini',         provider: 'OpenAI',     inputPer1M: 0.15,   outputPer1M: 0.60,  contextK: 128 },
  { id: 'gpt-4-turbo',        label: 'GPT-4 Turbo',         provider: 'OpenAI',     inputPer1M: 10,     outputPer1M: 30,    contextK: 128 },
  { id: 'claude-opus-4-6',    label: 'Claude Opus 4.6',     provider: 'Anthropic',  inputPer1M: 15,     outputPer1M: 75,    contextK: 200 },
  { id: 'claude-sonnet-4-6',  label: 'Claude Sonnet 4.6',   provider: 'Anthropic',  inputPer1M: 3,      outputPer1M: 15,    contextK: 200 },
  { id: 'claude-haiku',       label: 'Claude Haiku',        provider: 'Anthropic',  inputPer1M: 0.25,   outputPer1M: 1.25,  contextK: 200 },
  { id: 'gemini-1.5-pro',     label: 'Gemini 1.5 Pro',      provider: 'Google',     inputPer1M: 3.5,    outputPer1M: 10.5,  contextK: 1000 },
  { id: 'gemini-1.5-flash',   label: 'Gemini 1.5 Flash',    provider: 'Google',     inputPer1M: 0.075,  outputPer1M: 0.30,  contextK: 1000 },
  { id: 'llama-3.1-70b',      label: 'LLaMA 3.1 70B (API)', provider: 'Groq/etc',  inputPer1M: 0.59,   outputPer1M: 0.79,  contextK: 128 },
]

const LOCAL_MODELS = [
  { id: 'gemma3:latest',    label: 'Gemma 3',       gpuVramGB: 6,  cpuRamGB: 8  },
  { id: 'mistral:latest',   label: 'Mistral 7B',    gpuVramGB: 5,  cpuRamGB: 8  },
  { id: 'llama3:latest',    label: 'LLaMA 3 8B',    gpuVramGB: 6,  cpuRamGB: 8  },
  { id: 'codellama',        label: 'CodeLlama 7B',  gpuVramGB: 5,  cpuRamGB: 8  },
  { id: 'llama3-70b',       label: 'LLaMA 3 70B',   gpuVramGB: 40, cpuRamGB: 64 },
  { id: 'mistral-small3.1', label: 'Mistral Small', gpuVramGB: 6,  cpuRamGB: 8  },
]

function fmt(n: number): string {
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}k`
  if (n >= 1) return `$${n.toFixed(2)}`
  if (n >= 0.01) return `$${n.toFixed(4)}`
  return `$${n.toFixed(6)}`
}

export default function AiCostSimulator() {
  const [dailyRequests, setDailyRequests] = useState('1000')
  const [avgInputTokens, setAvgInputTokens] = useState('500')
  const [avgOutputTokens, setAvgOutputTokens] = useState('300')
  const [timeframeDays, setTimeframeDays] = useState('30')
  const [cloudModel, setCloudModel] = useState('gpt-4o-mini')
  const [electricityRate, setElectricityRate] = useState('0.12')
  const [gpuWatts, setGpuWatts] = useState('200')

  const requests = parseInt(dailyRequests) || 0
  const inputTok = parseInt(avgInputTokens) || 0
  const outputTok = parseInt(avgOutputTokens) || 0
  const days = parseInt(timeframeDays) || 30

  const cloudModelData = CLOUD_MODELS.find(m => m.id === cloudModel)!

  const costStats = useMemo(() => {
    const totalRequests = requests * days
    const totalInputM = (requests * inputTok * days) / 1_000_000
    const totalOutputM = (requests * outputTok * days) / 1_000_000
    const cloudCost = totalInputM * cloudModelData.inputPer1M + totalOutputM * cloudModelData.outputPer1M

    // Local electricity cost
    const hoursPerDay = (requests * (inputTok + outputTok) * 0.001) / 60 // rough: 1k tokens/min on GPU
    const kwhPerDay = (parseFloat(gpuWatts) / 1000) * Math.min(hoursPerDay, 24)
    const electricityCostPerDay = kwhPerDay * parseFloat(electricityRate)
    const localCost = electricityCostPerDay * days
    const savings = cloudCost - localCost

    return { totalRequests, totalInputM, totalOutputM, cloudCost, localCost, savings }
  }, [requests, inputTok, outputTok, days, cloudModelData, electricityRate, gpuWatts])

  const perRequestCloud = costStats.cloudCost / (costStats.totalRequests || 1)

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* Inputs */}
      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-primary" /> Usage Parameters
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Requests / day', value: dailyRequests, set: setDailyRequests, placeholder: '1000' },
            { label: 'Avg input tokens', value: avgInputTokens, set: setAvgInputTokens, placeholder: '500' },
            { label: 'Avg output tokens', value: avgOutputTokens, set: setAvgOutputTokens, placeholder: '300' },
            { label: 'Timeframe (days)', value: timeframeDays, set: setTimeframeDays, placeholder: '30' },
          ].map(f => (
            <div key={f.label}>
              <Label className="text-xs mb-1.5 block">{f.label}</Label>
              <Input
                type="number"
                min={0}
                value={f.value}
                onChange={e => f.set(e.target.value)}
                placeholder={f.placeholder}
                className="h-9"
              />
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          Total: <strong>{(costStats.totalRequests).toLocaleString()}</strong> requests ·{' '}
          <strong>{costStats.totalInputM.toFixed(1)}M</strong> input tokens ·{' '}
          <strong>{costStats.totalOutputM.toFixed(1)}M</strong> output tokens
        </div>
      </div>

      {/* Cloud model */}
      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" /> Cloud API Cost
        </h3>
        <div className="max-w-xs">
          <Label className="text-xs mb-1.5 block">Cloud model</Label>
          <Select value={cloudModel} onValueChange={setCloudModel}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['OpenAI', 'Anthropic', 'Google', 'Groq/etc'].map(provider => (
                <div key={provider}>
                  <div className="px-2 py-1 text-xs text-muted-foreground font-semibold">{provider}</div>
                  {CLOUD_MODELS.filter(m => m.provider === provider).map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.label} — ${m.inputPer1M}/1M in, ${m.outputPer1M}/1M out
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xl font-bold text-red-600">{fmt(costStats.cloudCost)}</p>
            <p className="text-xs text-muted-foreground">Total ({days}d)</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xl font-bold">{fmt(costStats.cloudCost / days)}</p>
            <p className="text-xs text-muted-foreground">Per day</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xl font-bold">{fmt(perRequestCloud)}</p>
            <p className="text-xs text-muted-foreground">Per request</p>
          </div>
        </div>
      </div>

      {/* Local cost */}
      <div className="rounded-xl border p-5 space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Server className="h-4 w-4 text-green-500" /> Local (Ollama) Electricity Cost
        </h3>

        <div className="grid grid-cols-2 gap-3 max-w-xs">
          <div>
            <Label className="text-xs mb-1.5 block">GPU power (watts)</Label>
            <Input type="number" value={gpuWatts} onChange={e => setGpuWatts(e.target.value)} className="h-9" placeholder="200" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Electricity ($/kWh)</Label>
            <Input type="number" step="0.01" value={electricityRate} onChange={e => setElectricityRate(e.target.value)} className="h-9" placeholder="0.12" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xl font-bold text-green-600">{fmt(costStats.localCost)}</p>
            <p className="text-xs text-muted-foreground">Electricity ({days}d)</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xl font-bold">{fmt(costStats.localCost / days)}</p>
            <p className="text-xs text-muted-foreground">Per day</p>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xl font-bold text-green-600">
              {costStats.savings > 0 ? fmt(costStats.savings) : '$0'}
            </p>
            <p className="text-xs text-muted-foreground">Savings vs cloud</p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Hardware cost & maintenance not included. Based on rough inference speed estimates.
        </div>
      </div>

      {/* Comparison table */}
      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/50 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">All cloud models — {days}-day cost at your usage</span>
        </div>
        <div className="divide-y">
          {[...CLOUD_MODELS]
            .map(m => {
              const c = (costStats.totalInputM * m.inputPer1M) + (costStats.totalOutputM * m.outputPer1M)
              return { ...m, cost: c }
            })
            .sort((a, b) => a.cost - b.cost)
            .map(m => (
              <div key={m.id} className={`flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors ${m.id === cloudModel ? 'bg-primary/5' : ''}`}>
                <div className="flex items-center gap-2.5">
                  <Badge variant="outline" className="text-xs w-20 justify-center">{m.provider}</Badge>
                  <span className="text-sm">{m.label}</span>
                  {m.id === cloudModel && <Badge className="text-xs">selected</Badge>}
                </div>
                <div className="text-right">
                  <span className="font-semibold text-sm">{fmt(m.cost)}</span>
                  <span className="text-xs text-muted-foreground ml-2">({fmt(m.cost / days)}/day)</span>
                </div>
              </div>
            ))}
          <div className="flex items-center justify-between px-4 py-2.5 bg-green-500/5">
            <div className="flex items-center gap-2.5">
              <Badge variant="outline" className="text-xs w-20 justify-center text-green-600">Local</Badge>
              <span className="text-sm font-medium">Ollama (electricity only)</span>
            </div>
            <div className="text-right">
              <span className="font-semibold text-sm text-green-600">{fmt(costStats.localCost)}</span>
              <span className="text-xs text-muted-foreground ml-2">({fmt(costStats.localCost / days)}/day)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

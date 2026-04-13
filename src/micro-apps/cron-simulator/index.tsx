'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CronExpressionParser } from 'cron-parser'
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'

interface CronResult {
  next10: string[]
  description: string
  isValid: boolean
  error?: string
}

export default function CronSimulator() {
  const [cron, setCron] = useState('0 9 * * MON-FRI')
  const [result, setResult] = useState<CronResult | null>(null)
  const [error, setError] = useState('')

  function parseCron() {
    setError('')
    setResult(null)

    if (!cron.trim()) {
      setError('Please enter a cron expression')
      return
    }

    try {
      const interval = CronExpressionParser.parse(cron.trim())
      const next10: string[] = []

      for (let i = 0; i < 10; i++) {
        const next = interval.next()
        next10.push(next.toDate().toLocaleString())
      }

      const description = describeCron(cron.trim())

      setResult({
        next10,
        description,
        isValid: true,
      })
    } catch (e) {
      setError(`Invalid cron expression: ${(e as Error).message}`)
    }
  }

  function describeCron(expr: string): string {
    const parts = expr.trim().split(/\s+/)
    if (parts.length !== 5) return 'Invalid format'

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

    let desc = 'Runs '

    // Build description
    const times = []
    if (minute === '*' && hour === '*') {
      times.push('every minute')
    } else if (minute === '0' && hour === '*') {
      times.push('every hour')
    } else if (minute === '0' && hour === '*/4') {
      times.push('every 4 hours')
    } else if (minute === '0' && hour !== '*') {
      times.push(`at ${hour}:00`)
    } else if (minute !== '*' && hour !== '*') {
      times.push(`at ${hour}:${minute}`)
    }

    const days = []
    if (dayOfWeek !== '*' && dayOfWeek !== '?') {
      days.push(`on ${dayOfWeek}`)
    } else if (dayOfMonth !== '*' && dayOfMonth !== '?') {
      if (dayOfMonth === '1') days.push('on the 1st')
      else if (dayOfMonth === '15') days.push('on the 15th')
      else days.push(`on day ${dayOfMonth}`)
    }

    if (times.length > 0) desc += times.join(' ')
    if (days.length > 0) desc += ' ' + days.join(' ')

    if (desc === 'Runs ') {
      desc = 'Custom cron schedule: ' + expr
    }

    return desc.charAt(0).toUpperCase() + desc.slice(1)
  }

  const cronExamples = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every day at 9 AM', value: '0 9 * * *' },
    { label: 'Weekdays at 9 AM', value: '0 9 * * MON-FRI' },
    { label: 'Every Monday', value: '0 0 * * MON' },
    { label: '1st day of month', value: '0 0 1 * *' },
    { label: 'Every 6 hours', value: '0 */6 * * *' },
    { label: 'Every 15 minutes', value: '*/15 * * * *' },
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Cron Expression</label>
          <Input
            value={cron}
            onChange={e => setCron(e.target.value)}
            placeholder="0 9 * * MON-FRI"
            className="font-mono text-sm"
            onKeyDown={e => e.key === 'Enter' && parseCron()}
          />
          <p className="text-xs text-muted-foreground">Format: minute hour day month dayOfWeek</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {cronExamples.map(ex => (
            <Button
              key={ex.value}
              size="sm"
              variant="outline"
              onClick={() => {
                setCron(ex.value)
                setTimeout(() => {
                  try {
                    const interval = CronExpressionParser.parse(ex.value)
                    const next10: string[] = []
                    for (let i = 0; i < 10; i++) {
                      next10.push(interval.next().toDate().toLocaleString())
                    }
                    setResult({
                      next10,
                      description: describeCron(ex.value),
                      isValid: true,
                    })
                  } catch (e) {
                    setError(`Error: ${(e as Error).message}`)
                  }
                }, 0)
              }}
              className="text-xs"
            >
              {ex.label}
            </Button>
          ))}
        </div>

        <Button onClick={parseCron} className="gap-2 w-full">
          <RefreshCw className="h-4 w-4" />
          Parse Expression
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive flex gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="rounded-md border bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-mono font-semibold text-sm mb-1">{cron}</div>
                <div className="text-sm text-muted-foreground">{result.description}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Next 10 Execution Times</label>
            <div className="rounded-md border overflow-hidden">
              <div className="divide-y">
                {result.next10.map((time, i) => (
                  <div
                    key={i}
                    className="px-3 py-3 hover:bg-muted/50 transition-colors text-sm font-mono flex items-center gap-3"
                  >
                    <Badge variant="outline" className="shrink-0">
                      {i + 1}
                    </Badge>
                    <span>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && !error && (
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Enter a cron expression to see upcoming execution times</p>
        </div>
      )}
    </div>
  )
}

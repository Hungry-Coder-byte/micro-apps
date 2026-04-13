'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RotateCcw } from 'lucide-react'

const ATTEMPTS = [
  { attempt: 1, delay: '1s',  cumulative: '1s'  },
  { attempt: 2, delay: '2s',  cumulative: '3s'  },
  { attempt: 3, delay: '4s',  cumulative: '7s'  },
  { attempt: 4, delay: '8s',  cumulative: '15s' },
  { attempt: 5, delay: '16s', cumulative: '31s' },
]

const BAR_WIDTHS = ['w-2', 'w-4', 'w-8', 'w-16', 'w-32']

export default function RetryPolicyCalculator() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Retry Policy Calculator</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="rounded-xl border p-4 grid grid-cols-2 gap-4">
        {[
          ['Strategy', ['Exponential Backoff', 'Linear', 'Fixed', 'Fibonacci']],
          ['Max Retries', null],
          ['Base Delay (ms)', null],
          ['Max Delay (ms)', null],
          ['Jitter', ['None', '±25%', '±50%', 'Full']],
          ['Multiplier', null],
        ].map(([label, opts]) => (
          <div key={label as string} className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label as string}</p>
            {opts ? (
              <select className="w-full text-xs border rounded-md px-2 py-1.5 bg-muted/40 text-muted-foreground" disabled>
                {(opts as string[]).map(o => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <div className="h-8 rounded-md border bg-muted/40" />
            )}
          </div>
        ))}
      </div>

      <Button size="sm" disabled><RotateCcw className="h-4 w-4 mr-1.5" />Calculate</Button>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Backoff Timeline</div>
        <div className="divide-y">
          {ATTEMPTS.map((a, i) => (
            <div key={i} className="px-4 py-2.5 flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground w-16">Attempt {a.attempt}</span>
              <div className={`h-2 rounded-full bg-primary/30 ${BAR_WIDTHS[i]}`} />
              <span className="text-xs font-mono text-blue-500">{a.delay}</span>
              <span className="text-xs text-muted-foreground ml-auto">total: {a.cumulative}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

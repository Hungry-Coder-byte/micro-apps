'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw } from 'lucide-react'

const LOGS = [
  { time: '14:00:00', status: 200, latency: '112ms', ok: true },
  { time: '14:00:30', status: 200, latency: '98ms',  ok: true },
  { time: '14:01:00', status: 503, latency: '341ms', ok: false },
  { time: '14:01:30', status: 200, latency: '105ms', ok: true },
  { time: '14:02:00', status: 200, latency: '89ms',  ok: true },
]

export default function HttpPoller() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">HTTP Endpoint Poller</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 h-9 rounded-md border bg-muted/40" />
          <Button size="sm" disabled><RefreshCw className="h-4 w-4 mr-1.5" />Start Polling</Button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[['Interval', '30s'], ['Timeout', '5s'], ['Method', 'GET']].map(([k, v]) => (
            <div key={k} className="rounded-lg border bg-muted/20 px-3 py-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{k}</p>
              <p className="text-sm font-medium font-mono">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[['Uptime', '80%', 'text-green-500'], ['Avg Latency', '149ms', 'text-blue-500'], ['Errors', '1 / 5', 'text-red-500']].map(([k, v, c]) => (
          <div key={k} className="rounded-xl border p-3 text-center space-y-1">
            <p className={`text-2xl font-bold font-mono ${c}`}>{v}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{k}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Poll Log</div>
        <div className="divide-y font-mono text-xs">
          {LOGS.map((l, i) => (
            <div key={i} className="px-4 py-2 grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">{l.time}</span>
              <span className={l.ok ? 'text-green-500' : 'text-red-500'}>{l.status}</span>
              <span className="text-muted-foreground">{l.latency}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

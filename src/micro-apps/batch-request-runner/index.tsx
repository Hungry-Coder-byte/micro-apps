'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ListChecks } from 'lucide-react'

const REQUESTS = [
  { method: 'GET',    url: 'https://api.example.com/users/1',    status: 200, ms: 112 },
  { method: 'GET',    url: 'https://api.example.com/users/2',    status: 200, ms: 98  },
  { method: 'DELETE', url: 'https://api.example.com/posts/42',   status: 204, ms: 87  },
  { method: 'POST',   url: 'https://api.example.com/events',     status: 201, ms: 135 },
  { method: 'GET',    url: 'https://api.example.com/invalid',    status: 404, ms: 43  },
]

const STATUS_COLOR: Record<number, string> = { 200: 'text-green-500', 201: 'text-green-500', 204: 'text-blue-500', 404: 'text-red-500' }
const METHOD_COLOR: Record<string, string>  = { GET: 'text-blue-600', POST: 'text-green-600', DELETE: 'text-red-600' }

export default function BatchRequestRunner() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Batch Request Runner</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <p className="text-xs text-muted-foreground">Define multiple HTTP requests in JSON or CSV format, run them in parallel or sequentially, and see aggregated results.</p>

      <div className="rounded-xl border p-4 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input (JSON / CSV)</p>
        <div className="h-20 rounded-lg border bg-muted/40" />
        <div className="flex gap-2">
          <Button size="sm" disabled><ListChecks className="h-4 w-4 mr-1.5" />Run All</Button>
          <Button size="sm" variant="outline" disabled>Upload CSV</Button>
          <select className="text-xs border rounded-md px-2 py-1 bg-muted/40 text-muted-foreground" disabled>
            <option>Parallel</option>
            <option>Sequential</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Results (5 requests)</div>
        <div className="divide-y font-mono text-xs">
          {REQUESTS.map((r, i) => (
            <div key={i} className="px-4 py-2 grid grid-cols-4 gap-2 items-center">
              <span className={`font-semibold ${METHOD_COLOR[r.method] ?? 'text-muted-foreground'}`}>{r.method}</span>
              <span className="col-span-2 text-muted-foreground truncate">{r.url}</span>
              <div className="flex gap-2 justify-end">
                <span className={STATUS_COLOR[r.status] ?? 'text-muted-foreground'}>{r.status}</span>
                <span className="text-muted-foreground">{r.ms}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

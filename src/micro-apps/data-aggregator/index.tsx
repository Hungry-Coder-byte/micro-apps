'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Group } from 'lucide-react'

const RESULTS = [
  { dept: 'Platform', count: 2, total: 255000, avg: 127500 },
  { dept: 'Product',  count: 1, total: 105000, avg: 105000 },
  { dept: 'Backend',  count: 1, total: 118000, avg: 118000 },
]

export default function DataAggregator() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Data Aggregator</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <p className="text-xs text-muted-foreground">Group JSON or CSV data by a field and compute sum, average, count, min, max — like SQL GROUP BY in the browser.</p>

      <div className="rounded-xl border p-4 space-y-3">
        <div className="h-20 rounded-lg border bg-muted/40" />
        <div className="grid grid-cols-3 gap-3">
          {[['Group By', 'dept'], ['Aggregate', 'salary'], ['Function', 'SUM · AVG · COUNT']].map(([k, v]) => (
            <div key={k} className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{k}</p>
              <div className="h-8 rounded-md border bg-muted/40 px-2 flex items-center text-xs text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
        <Button size="sm" disabled><Group className="h-4 w-4 mr-1.5" />Aggregate</Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Aggregation Results</div>
        <table className="w-full text-xs">
          <thead className="bg-muted/20 border-b">
            <tr>
              {['dept', 'count', 'total salary', 'avg salary'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground capitalize">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {RESULTS.map(r => (
              <tr key={r.dept}>
                <td className="px-3 py-2 font-medium">{r.dept}</td>
                <td className="px-3 py-2 font-mono">{r.count}</td>
                <td className="px-3 py-2 font-mono">${r.total.toLocaleString()}</td>
                <td className="px-3 py-2 font-mono">${r.avg.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

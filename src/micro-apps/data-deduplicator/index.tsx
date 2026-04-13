'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy } from 'lucide-react'

const DUPES = [
  { id: 2, name: 'Alice', email: 'alice@example.com', occurrences: 3, keep: true },
  { id: 5, name: 'Bob',   email: 'bob@example.com',   occurrences: 2, keep: true },
]

const STATS = [{ label: 'Total Rows', value: '248' }, { label: 'Unique Rows', value: '201' }, { label: 'Duplicates', value: '47' }, { label: 'Savings', value: '19%' }]

export default function DataDeduplicator() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Data Deduplicator</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <p className="text-xs text-muted-foreground">Find and remove duplicate rows from JSON arrays or CSV files. Choose which fields to compare and which duplicate to keep.</p>

      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled>Upload CSV / JSON</Button>
          <span className="text-xs text-muted-foreground self-center">or paste below</span>
        </div>
        <div className="h-20 rounded-lg border bg-muted/40" />
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Compare by fields</p>
          <div className="flex gap-2">
            {['email', 'name', 'id'].map(f => (
              <label key={f} className="flex items-center gap-1.5 text-xs">
                <input type="checkbox" disabled className="accent-primary" defaultChecked={f === 'email'} /> {f}
              </label>
            ))}
          </div>
        </div>
        <Button size="sm" disabled><Copy className="h-4 w-4 mr-1.5" />Find Duplicates</Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {STATS.map(s => (
          <div key={s.label} className="rounded-xl border p-3 text-center">
            <p className="text-xl font-bold font-mono">{s.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Duplicate Groups</div>
        <div className="divide-y">
          {DUPES.map(d => (
            <div key={d.id} className="px-4 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{d.name} <span className="font-normal text-muted-foreground">— {d.email}</span></p>
                <p className="text-xs text-red-500">{d.occurrences}× duplicate</p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Keep first</Badge>
            </div>
          ))}
        </div>
      </div>

      <Button size="sm" disabled>Export Deduplicated Data</Button>
    </div>
  )
}

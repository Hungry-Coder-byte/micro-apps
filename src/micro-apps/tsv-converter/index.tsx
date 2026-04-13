'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Rows3 } from 'lucide-react'

const TSV = `name\trole\tdept\tsalary
Alice\tEngineer\tPlatform\t120000
Bob\tDesigner\tProduct\t105000
Carol\tManager\tPlatform\t135000`

const CSV = `name,role,dept,salary
Alice,Engineer,Platform,120000
Bob,Designer,Product,105000
Carol,Manager,Platform,135000`

export default function TsvConverter() {
  return (
    <div className="max-w-3xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">TSV ↔ CSV Converter</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="flex gap-2 items-center">
        <select className="text-xs border rounded-md px-2 py-1.5 bg-muted/40 text-muted-foreground" disabled>
          <option>TSV → CSV</option>
          <option>CSV → TSV</option>
          <option>TSV → JSON</option>
          <option>CSV → TSV</option>
        </select>
        <Button size="sm" disabled><Rows3 className="h-4 w-4 mr-1.5" />Convert</Button>
        <Button size="sm" variant="outline" disabled>Download</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">TSV Input</p>
          <pre className="text-[11px] font-mono bg-muted/40 rounded-xl border p-3 h-36 overflow-auto text-muted-foreground">{TSV}</pre>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CSV Output</p>
          <pre className="text-[11px] font-mono bg-green-50 border border-green-200 rounded-xl p-3 h-36 overflow-auto text-green-700">{CSV}</pre>
        </div>
      </div>

      <div className="rounded-xl border p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Options</p>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {['Include header row', 'Quote fields with commas', 'Trim whitespace', 'Skip empty rows'].map(o => (
            <label key={o} className="flex items-center gap-1.5">
              <input type="checkbox" disabled className="accent-primary" defaultChecked /> {o}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

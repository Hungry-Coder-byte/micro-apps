'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileSpreadsheet } from 'lucide-react'

const SHEETS = ['Employees', 'Departments', 'Salaries']

const PREVIEW = [
  { id: 1, name: 'Alice', role: 'Engineer', dept: 'Platform' },
  { id: 2, name: 'Bob',   role: 'Designer', dept: 'Product'  },
  { id: 3, name: 'Carol', role: 'Manager',  dept: 'Platform' },
]

export default function ExcelToJson() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Excel → JSON Converter</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="rounded-xl border border-dashed p-8 flex flex-col items-center gap-3 bg-muted/10">
        <FileSpreadsheet className="h-8 w-8 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Drop an Excel file (.xlsx / .xls / .ods) here</p>
        <Button size="sm" variant="outline" disabled>Browse File</Button>
      </div>

      <div className="rounded-xl border p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sheets Detected</p>
        <div className="flex gap-2">
          {SHEETS.map((s, i) => (
            <Badge key={s} variant={i === 0 ? 'default' : 'outline'} className="text-xs">{s}</Badge>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between text-xs">
          <span className="font-medium">Employees — 3 rows</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" disabled>Copy JSON</Button>
            <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" disabled>Download</Button>
          </div>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-muted/20 border-b">
            <tr>
              {['id', 'name', 'role', 'dept'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {PREVIEW.map(r => (
              <tr key={r.id}>
                <td className="px-3 py-2 font-mono text-muted-foreground">{r.id}</td>
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2">{r.role}</td>
                <td className="px-3 py-2">{r.dept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border p-3 space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Output Format</p>
        <div className="flex gap-3 text-xs text-muted-foreground">
          {['Array of objects (default)', 'Array of arrays', 'Keyed by first column'].map(o => (
            <label key={o} className="flex items-center gap-1.5">
              <input type="radio" name="format" disabled defaultChecked={o.includes('default')} /> {o}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LayoutGrid } from 'lucide-react'

const SAMPLE = [
  { id: 1, name: 'Alice',   role: 'Engineer', dept: 'Platform', salary: 120000 },
  { id: 2, name: 'Bob',     role: 'Designer', dept: 'Product',  salary: 105000 },
  { id: 3, name: 'Carol',   role: 'Manager',  dept: 'Platform', salary: 135000 },
  { id: 4, name: 'David',   role: 'Engineer', dept: 'Backend',  salary: 118000 },
]

const COLS = ['id', 'name', 'role', 'dept', 'salary']

export default function JsonToTable() {
  return (
    <div className="max-w-3xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">JSON Array → Table Viewer</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="rounded-xl border p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Paste JSON Array</p>
        <div className="h-24 rounded-lg border bg-muted/40" />
        <div className="flex gap-2">
          <Button size="sm" disabled><LayoutGrid className="h-4 w-4 mr-1.5" />Render Table</Button>
          <Button size="sm" variant="outline" disabled>Upload JSON</Button>
          <Button size="sm" variant="outline" disabled>Export CSV</Button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center justify-between text-xs">
          <span className="font-medium">4 rows · 5 columns</span>
          <div className="flex gap-1">
            {COLS.map(c => (
              <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/20 border-b">
              <tr>
                {COLS.map(c => (
                  <th key={c} className="px-3 py-2 text-left font-medium text-muted-foreground capitalize">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {SAMPLE.map((row) => (
                <tr key={row.id} className="hover:bg-muted/10">
                  <td className="px-3 py-2 font-mono text-muted-foreground">{row.id}</td>
                  <td className="px-3 py-2 font-medium">{row.name}</td>
                  <td className="px-3 py-2">{row.role}</td>
                  <td className="px-3 py-2">{row.dept}</td>
                  <td className="px-3 py-2 font-mono">${row.salary.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

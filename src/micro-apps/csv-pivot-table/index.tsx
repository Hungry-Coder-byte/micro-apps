'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table2 } from 'lucide-react'

const PIVOT = {
  rows: ['North', 'South', 'East', 'West'],
  cols: ['Q1', 'Q2', 'Q3', 'Q4'],
  data: [
    [12400, 14200, 13100, 15800],
    [8900,  9300,  10200, 11400],
    [6700,  7100,  7800,  8200],
    [9100,  10500, 9800,  12300],
  ],
}

export default function CsvPivotTable() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">CSV Pivot Table</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex gap-2 items-center">
          <Button size="sm" variant="outline" disabled>Upload CSV</Button>
          <span className="text-xs text-muted-foreground">or paste below</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[['Row Field', 'Region'], ['Column Field', 'Quarter'], ['Value Field', 'Revenue']].map(([k, v]) => (
            <div key={k} className="space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{k}</p>
              <div className="h-8 rounded-md border bg-muted/40 px-2 flex items-center text-xs text-muted-foreground">{v}</div>
            </div>
          ))}
        </div>
        <Button size="sm" disabled><Table2 className="h-4 w-4 mr-1.5" />Build Pivot</Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted/30 border-b">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Region</th>
                {PIVOT.cols.map(c => <th key={c} className="px-3 py-2 text-right font-medium text-muted-foreground">{c}</th>)}
                <th className="px-3 py-2 text-right font-semibold text-muted-foreground">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {PIVOT.rows.map((row, i) => (
                <tr key={row} className="hover:bg-muted/10">
                  <td className="px-3 py-2 font-medium">{row}</td>
                  {PIVOT.data[i].map((v, j) => (
                    <td key={j} className="px-3 py-2 text-right font-mono">{v.toLocaleString()}</td>
                  ))}
                  <td className="px-3 py-2 text-right font-mono font-semibold">
                    {PIVOT.data[i].reduce((a, b) => a + b, 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

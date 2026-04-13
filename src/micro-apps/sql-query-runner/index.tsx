'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Terminal } from 'lucide-react'

const QUERY = `SELECT dept, COUNT(*) AS headcount,
       AVG(salary) AS avg_salary
FROM   employees
GROUP  BY dept
ORDER  BY avg_salary DESC;`

const RESULTS = [
  { dept: 'Platform', headcount: 2, avg_salary: '$127,500' },
  { dept: 'Backend',  headcount: 1, avg_salary: '$118,000' },
  { dept: 'Product',  headcount: 1, avg_salary: '$105,000' },
]

export default function SqlQueryRunner() {
  return (
    <div className="max-w-3xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">In-Browser SQL Query Runner</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <p className="text-xs text-muted-foreground">Upload CSV or JSON files as tables, then query them with standard SQL using SQLite compiled to WebAssembly.</p>

      <div className="rounded-xl border p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Loaded Tables</p>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs font-mono">employees (4 rows)</Badge>
          <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" disabled>+ Upload CSV/JSON</Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">SQL Query</p>
        <pre className="text-xs font-mono bg-[#1e1e2e] text-[#cdd6f4] rounded-xl border p-3 leading-relaxed">{QUERY}</pre>
        <Button size="sm" disabled><Terminal className="h-4 w-4 mr-1.5" />Run Query</Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Results — 3 rows in 2ms</div>
        <table className="w-full text-xs">
          <thead className="bg-muted/20 border-b">
            <tr>
              {['dept', 'headcount', 'avg_salary'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {RESULTS.map(r => (
              <tr key={r.dept}>
                <td className="px-3 py-2 font-medium">{r.dept}</td>
                <td className="px-3 py-2 font-mono">{r.headcount}</td>
                <td className="px-3 py-2 font-mono">{r.avg_salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

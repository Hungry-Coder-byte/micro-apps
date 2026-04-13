'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FoldVertical } from 'lucide-react'

const NESTED = `{
  "user": {
    "id": 1,
    "name": "Alice",
    "address": {
      "city": "New York",
      "zip": "10001"
    }
  },
  "roles": ["admin", "editor"]
}`

const FLAT = `{
  "user.id": 1,
  "user.name": "Alice",
  "user.address.city": "New York",
  "user.address.zip": "10001",
  "roles.0": "admin",
  "roles.1": "editor"
}`

export default function JsonFlatten() {
  return (
    <div className="max-w-3xl mx-auto space-y-5 opacity-70 pointer-events-none select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">JSON Flatten / Unflatten</h2>
        <Badge variant="outline" className="text-amber-600 border-amber-400 bg-amber-50 text-xs">Coming Soon</Badge>
      </div>

      <p className="text-xs text-muted-foreground">Convert deeply nested JSON into a flat key-value structure (or reverse). Useful for dotenv, config files, and spreadsheet exports.</p>

      <div className="flex gap-2 items-center">
        <select className="text-xs border rounded-md px-2 py-1.5 bg-muted/40 text-muted-foreground" disabled>
          <option>Flatten (nested → flat)</option>
          <option>Unflatten (flat → nested)</option>
        </select>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Delimiter:
          <select className="border rounded px-1.5 py-1 bg-muted/40" disabled>
            <option>. (dot)</option>
            <option>_ (underscore)</option>
            <option>/ (slash)</option>
          </select>
        </div>
        <Button size="sm" disabled><FoldVertical className="h-4 w-4 mr-1.5" />Convert</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nested JSON</p>
          <pre className="text-[11px] font-mono bg-muted/40 rounded-xl border p-3 h-52 overflow-auto text-muted-foreground">{NESTED}</pre>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Flat JSON</p>
          <pre className="text-[11px] font-mono bg-green-50 border border-green-200 rounded-xl p-3 h-52 overflow-auto text-green-700">{FLAT}</pre>
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled>Copy Output</Button>
        <Button size="sm" variant="outline" disabled>Download</Button>
      </div>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GitCompare, Construction } from 'lucide-react'

const LEFT = `{
  "name": "Alice",
  "age": 28,
  "role": "developer",
  "skills": ["JS", "TS", "React"]
}`

const RIGHT = `{
  "name": "Alice",
  "age": 29,
  "role": "senior developer",
  "skills": ["JS", "TS", "React", "Node.js"],
  "location": "New York"
}`

export default function JsonDiff() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Original (Left)</p>
          <textarea defaultValue={LEFT} rows={14}
            className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Paste original JSON…" />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Modified (Right)</p>
          <textarea defaultValue={RIGHT} rows={14}
            className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Paste modified JSON…" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <GitCompare className="h-4 w-4" /> Compare
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>

      {/* Diff preview placeholder */}
      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2 bg-muted/30 border-b text-xs font-medium text-muted-foreground">Diff Result</div>
        <div className="p-4 space-y-1 text-xs font-mono">
          <p className="text-muted-foreground">  {`{`}</p>
          <p className="text-muted-foreground">    "name": "Alice",</p>
          <p className="text-red-500 bg-red-500/10 px-1 rounded">-   "age": 28,</p>
          <p className="text-green-600 bg-green-500/10 px-1 rounded">+   "age": 29,</p>
          <p className="text-red-500 bg-red-500/10 px-1 rounded">-   "role": "developer",</p>
          <p className="text-green-600 bg-green-500/10 px-1 rounded">+   "role": "senior developer",</p>
          <p className="text-muted-foreground">    "skills": [...]</p>
          <p className="text-green-600 bg-green-500/10 px-1 rounded">+   "location": "New York"</p>
          <p className="text-muted-foreground">  {`}`}</p>
          <p className="text-xs text-muted-foreground/60 mt-2 not-italic">(Preview only — functionality coming soon)</p>
        </div>
      </div>
    </div>
  )
}

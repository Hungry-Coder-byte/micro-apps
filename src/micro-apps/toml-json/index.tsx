'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeftRight, Construction } from 'lucide-react'

const TOML_SAMPLE = `[database]
server = "192.168.1.1"
ports = [ 8001, 8001, 8002 ]
enabled = true

[servers]
  [servers.alpha]
  ip = "10.0.0.1"
  role = "frontend"

  [servers.beta]
  ip = "10.0.0.2"
  role = "backend"

[owner]
name = "Tom Preston-Werner"
dob = 1979-05-27T07:32:00Z`

const JSON_SAMPLE = `{
  "database": {
    "server": "192.168.1.1",
    "ports": [8001, 8001, 8002],
    "enabled": true
  },
  "servers": {
    "alpha": { "ip": "10.0.0.1", "role": "frontend" },
    "beta":  { "ip": "10.0.0.2", "role": "backend" }
  },
  "owner": {
    "name": "Tom Preston-Werner",
    "dob": "1979-05-27T07:32:00Z"
  }
}`

export default function TomlJson() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        <button className="text-xs px-3 py-1.5 rounded-md bg-background shadow-sm font-medium">TOML → JSON</button>
        <button className="text-xs px-3 py-1.5 rounded-md text-muted-foreground">JSON → TOML</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">TOML Input</p>
          <textarea defaultValue={TOML_SAMPLE} rows={18}
            className="w-full rounded-lg border bg-muted/30 p-3 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Paste TOML here…" />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">JSON Output</p>
          <div className="w-full h-[calc(18*1.5rem+24px)] rounded-lg border bg-muted/20 p-3 text-xs font-mono text-muted-foreground whitespace-pre-wrap overflow-auto">
            {JSON_SAMPLE}
            <p className="text-muted-foreground/50 mt-2 text-[10px]">(Preview only)</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <ArrowLeftRight className="h-4 w-4" /> Convert
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}

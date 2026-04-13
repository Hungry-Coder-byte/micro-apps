'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tag, Construction } from 'lucide-react'

const RANGES = [
  { range: '^1.2.3',   desc: 'Compatible with 1.2.3',        matches: '≥1.2.3 <2.0.0' },
  { range: '~1.2.3',   desc: 'Approximately equivalent',     matches: '≥1.2.3 <1.3.0' },
  { range: '1.2.x',    desc: 'Any patch version',            matches: '≥1.2.0 <1.3.0' },
  { range: '>=1.2.0',  desc: 'Greater than or equal',        matches: '≥1.2.0' },
  { range: '1.2 - 2.3',desc: 'Hyphen range',                 matches: '≥1.2.0 ≤2.3.x' },
  { range: '*',         desc: 'Any version',                  matches: 'all' },
]

export default function SemverCalculator() {
  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs mb-1.5 block">Current version</Label>
          <Input defaultValue="1.4.2" className="font-mono h-10 text-lg" placeholder="1.0.0" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Version range / constraint</Label>
          <Input defaultValue="^1.2.3" className="font-mono h-10 text-lg" placeholder="^1.2.3" />
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <p className="text-xs font-medium">Next version bumps</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Patch', from: '1.4.2', to: '1.4.3', desc: 'Bug fixes' },
            { label: 'Minor', from: '1.4.2', to: '1.5.0', desc: 'New features' },
            { label: 'Major', from: '1.4.2', to: '2.0.0', desc: 'Breaking changes' },
          ].map(b => (
            <div key={b.label} className="rounded-lg border bg-muted/20 p-3 text-center">
              <p className="text-xs font-semibold">{b.label}</p>
              <p className="font-mono text-sm font-bold mt-1 text-primary">{b.to}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Range reference</p>
        </div>
        <div className="divide-y">
          {RANGES.map(r => (
            <div key={r.range} className="px-4 py-2.5 grid grid-cols-3 gap-2 items-center text-xs">
              <code className="font-mono font-medium">{r.range}</code>
              <span className="text-muted-foreground">{r.desc}</span>
              <code className="font-mono text-muted-foreground text-[10px]">{r.matches}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Tag className="h-4 w-4" /> Check Compatibility
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}

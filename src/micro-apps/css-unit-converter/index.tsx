'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Ruler, Construction } from 'lucide-react'

const UNITS = [
  { label: 'px',   name: 'Pixels',              value: '16' },
  { label: 'rem',  name: 'Root em',             value: '1' },
  { label: 'em',   name: 'Em (relative)',        value: '1' },
  { label: '%',    name: 'Percent',              value: '100' },
  { label: 'vw',   name: 'Viewport width',       value: '1.25' },
  { label: 'vh',   name: 'Viewport height',      value: '2.22' },
  { label: 'pt',   name: 'Points',               value: '12' },
  { label: 'cm',   name: 'Centimeters',          value: '0.42' },
  { label: 'mm',   name: 'Millimeters',          value: '4.23' },
  { label: 'in',   name: 'Inches',               value: '0.17' },
]

export default function CssUnitConverter() {
  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="rounded-xl border p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1.5 block">Root font size (px)</Label>
            <Input defaultValue="16" type="number" className="h-9 font-mono" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Viewport width (px)</Label>
            <Input defaultValue="1280" type="number" className="h-9 font-mono" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Viewport height (px)</Label>
            <Input defaultValue="720" type="number" className="h-9 font-mono" />
          </div>
          <div>
            <Label className="text-xs mb-1.5 block">Parent element size (px)</Label>
            <Input defaultValue="16" type="number" className="h-9 font-mono" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="px-4 py-2.5 border-b bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">All unit equivalents for 16px</p>
        </div>
        <div className="divide-y">
          {UNITS.map(u => (
            <div key={u.label} className="flex items-center px-4 py-2.5 gap-3 hover:bg-muted/10">
              <Badge variant="outline" className="font-mono text-xs w-12 justify-center shrink-0">{u.label}</Badge>
              <span className="text-xs text-muted-foreground flex-1">{u.name}</span>
              <span className="text-xs font-mono">{u.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Ruler className="h-4 w-4" /> Convert
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}

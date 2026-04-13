'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

// All factors relative to m/s
const UNITS = [
  { label: 'm/s',   name: 'Meters per second',      factor: 1 },
  { label: 'km/h',  name: 'Kilometers per hour',    factor: 1 / 3.6 },
  { label: 'mph',   name: 'Miles per hour',          factor: 0.44704 },
  { label: 'ft/s',  name: 'Feet per second',         factor: 0.3048 },
  { label: 'knots', name: 'Nautical miles per hour', factor: 0.514444 },
  { label: 'Mach',  name: 'Mach (at sea level)',     factor: 343 },
]

function fmt(n: number): string {
  if (n === 0) return '0'
  if (Math.abs(n) < 0.0001) return n.toExponential(4)
  return parseFloat(n.toPrecision(7)).toLocaleString('en-US', { maximumFractionDigits: 6 })
}

export default function SpeedConverter() {
  const [values, setValues] = useState<string[]>(Array(UNITS.length).fill(''))
  const [activeIdx, setActiveIdx] = useState(-1)

  function handleChange(idx: number, raw: string) {
    if (raw !== '' && isNaN(parseFloat(raw))) return
    setActiveIdx(idx)
    if (!raw) { setValues(Array(UNITS.length).fill('')); return }
    const ms = parseFloat(raw) * UNITS[idx].factor
    setValues(UNITS.map(u => fmt(ms / u.factor)))
  }

  const examples = [
    { label: 'Walking (5 km/h)', idx: 1, val: '5' },
    { label: 'Cycling (25 km/h)', idx: 1, val: '25' },
    { label: 'Highway (100 km/h)', idx: 1, val: '100' },
    { label: 'Sound (343 m/s)', idx: 0, val: '343' },
    { label: 'Light (3×10⁸ m/s)', idx: 0, val: '299792458' },
  ]

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="space-y-3">
        {UNITS.map((u, i) => (
          <div key={u.label} className="flex items-center gap-3">
            <div className="w-20 shrink-0">
              <Badge variant={activeIdx === i ? 'default' : 'outline'} className="font-mono text-xs w-full justify-center">
                {u.label}
              </Badge>
            </div>
            <div className="flex-1 min-w-0">
              <Input
                value={values[i]}
                onChange={e => handleChange(i, e.target.value)}
                placeholder="0"
                className="font-mono h-9"
                type="number"
                min={0}
              />
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block w-44 shrink-0">{u.name}</span>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Real-world examples</p>
        <div className="flex flex-wrap gap-1.5">
          {examples.map(ex => (
            <button key={ex.label} onClick={() => handleChange(ex.idx, ex.val)}
              className="text-xs px-2.5 py-1 rounded-md border hover:bg-muted/50 transition-colors">
              {ex.label}
            </button>
          ))}
          <button onClick={() => { setValues(Array(UNITS.length).fill('')); setActiveIdx(-1) }}
            className="text-xs px-2.5 py-1 rounded-md border border-dashed hover:bg-muted/50 transition-colors text-muted-foreground">
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

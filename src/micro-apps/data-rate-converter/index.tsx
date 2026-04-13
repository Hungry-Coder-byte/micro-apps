'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

// All units in bits per second
const UNITS = [
  { label: 'bps',   name: 'Bits per second',      factor: 1 },
  { label: 'Kbps',  name: 'Kilobits per second',   factor: 1e3 },
  { label: 'Mbps',  name: 'Megabits per second',   factor: 1e6 },
  { label: 'Gbps',  name: 'Gigabits per second',   factor: 1e9 },
  { label: 'Tbps',  name: 'Terabits per second',   factor: 1e12 },
  { label: 'KB/s',  name: 'Kilobytes per second',  factor: 8e3 },
  { label: 'MB/s',  name: 'Megabytes per second',  factor: 8e6 },
  { label: 'GB/s',  name: 'Gigabytes per second',  factor: 8e9 },
]

function smartFormat(n: number): string {
  if (n === 0) return '0'
  if (Math.abs(n) >= 1e12) return (n / 1e12).toPrecision(6).replace(/\.?0+$/, '') + ' × 10¹²'
  if (Math.abs(n) < 0.0001) return n.toExponential(4)
  const s = parseFloat(n.toPrecision(6))
  return s.toLocaleString('en-US', { maximumFractionDigits: 6 })
}

export default function DataRateConverter() {
  const [values, setValues] = useState<string[]>(Array(UNITS.length).fill(''))
  const [activeIdx, setActiveIdx] = useState(-1)

  function handleChange(idx: number, raw: string) {
    if (raw !== '' && isNaN(parseFloat(raw))) return
    setActiveIdx(idx)
    if (!raw || raw === '-') {
      setValues(Array(UNITS.length).fill(''))
      return
    }
    const bps = parseFloat(raw) * UNITS[idx].factor
    setValues(UNITS.map(u => smartFormat(bps / u.factor)))
  }

  const presets = [
    { label: '1 Mbps', idx: 2, val: '1' },
    { label: '100 Mbps', idx: 2, val: '100' },
    { label: '1 Gbps', idx: 3, val: '1' },
    { label: '10 Gbps', idx: 3, val: '10' },
    { label: '100 MB/s', idx: 6, val: '100' },
  ]

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {UNITS.map((u, i) => (
          <div key={u.label}>
            <Label className="text-xs mb-1.5 flex items-center gap-2">
              <Badge variant={activeIdx === i ? 'default' : 'outline'} className="font-mono text-[10px] px-1.5">{u.label}</Badge>
              <span className="text-muted-foreground">{u.name}</span>
            </Label>
            <Input
              value={values[i]}
              onChange={e => handleChange(i, e.target.value)}
              placeholder="0"
              className="font-mono h-9"
              type="number"
              min={0}
            />
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">Quick presets</p>
        <div className="flex flex-wrap gap-1.5">
          {presets.map(p => (
            <button key={p.label} onClick={() => handleChange(p.idx, p.val)}
              className="text-xs px-2.5 py-1 rounded-md border hover:bg-muted/50 transition-colors">
              {p.label}
            </button>
          ))}
          <button onClick={() => setValues(Array(UNITS.length).fill(''))}
            className="text-xs px-2.5 py-1 rounded-md border border-dashed hover:bg-muted/50 transition-colors text-muted-foreground">
            Clear
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Note: 1 byte = 8 bits. Kilo/Mega/Giga use SI (powers of 10), not binary (1000 vs 1024).
      </p>
    </div>
  )
}

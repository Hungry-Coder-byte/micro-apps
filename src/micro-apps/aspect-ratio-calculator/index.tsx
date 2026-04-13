'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b) }

const PRESETS = [
  { label: '16:9',   w: 16, h: 9,  note: 'HD/4K' },
  { label: '4:3',    w: 4,  h: 3,  note: 'SD/tablet' },
  { label: '1:1',    w: 1,  h: 1,  note: 'Square' },
  { label: '21:9',   w: 21, h: 9,  note: 'Ultrawide' },
  { label: '3:2',    w: 3,  h: 2,  note: 'DSLR photo' },
  { label: '9:16',   w: 9,  h: 16, note: 'Portrait/Reel' },
  { label: '4:5',    w: 4,  h: 5,  note: 'Instagram portrait' },
  { label: '2.39:1', w: 239, h: 100, note: 'Cinemascope' },
]

export default function AspectRatioCalculator() {
  // From dimensions tab
  const [width,  setWidth]  = useState('1920')
  const [height, setHeight] = useState('1080')

  // Scale tab
  const [ratioW, setRatioW] = useState('16')
  const [ratioH, setRatioH] = useState('9')
  const [scaleW, setScaleW] = useState('1920')
  const [scaleH, setScaleH] = useState('')

  const [tab, setTab] = useState<'from-dimensions' | 'scale'>('from-dimensions')

  const ratio = useMemo(() => {
    const w = parseInt(width), h = parseInt(height)
    if (!w || !h || w <= 0 || h <= 0) return null
    const g = gcd(w, h)
    return { rw: w / g, rh: h / g, decimal: (w / h).toFixed(4), pct: ((h / w) * 100).toFixed(2) }
  }, [width, height])

  const scaled = useMemo(() => {
    const rw = parseFloat(ratioW), rh = parseFloat(ratioH)
    const sw = parseFloat(scaleW), sh = parseFloat(scaleH)
    if (!rw || !rh) return null
    if (sw && !scaleH) return { w: sw, h: Math.round(sw * rh / rw) }
    if (sh && !scaleW) return { h: sh, w: Math.round(sh * rw / rh) }
    if (sw && sh) return { w: sw, h: sh }
    return null
  }, [ratioW, ratioH, scaleW, scaleH])

  function handleScaleW(v: string) { setScaleW(v); if (v) setScaleH('') }
  function handleScaleH(v: string) { setScaleH(v); if (v) setScaleW('') }

  function applyPreset(rw: number, rh: number) {
    setRatioW(String(rw)); setRatioH(String(rh))
    setScaleW('1920'); setScaleH('')
    setTab('scale')
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Presets */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Common ratios</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => applyPreset(p.w, p.h)}
              className="text-xs px-2.5 py-1.5 rounded-md border hover:bg-muted/50 transition-colors flex flex-col items-center gap-0">
              <span className="font-mono font-medium">{p.label}</span>
              <span className="text-muted-foreground text-[10px]">{p.note}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        {([['from-dimensions', 'From Dimensions'], ['scale', 'Scale by Ratio']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${tab === id ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'from-dimensions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1.5 block">Width (px)</Label>
              <Input value={width}  onChange={e => setWidth(e.target.value)}  type="number" min={1} className="h-9 font-mono" />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Height (px)</Label>
              <Input value={height} onChange={e => setHeight(e.target.value)} type="number" min={1} className="h-9 font-mono" />
            </div>
          </div>

          {ratio && (
            <div className="rounded-xl border bg-muted/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Aspect Ratio</span>
                <Badge className="font-mono text-base px-3 py-1">{ratio.rw}:{ratio.rh}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Decimal</span>
                <span className="font-mono">{ratio.decimal}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Height as % of width</span>
                <span className="font-mono">{ratio.pct}%</span>
              </div>
              {/* Visual preview */}
              <div className="mt-3">
                <div className="bg-primary/20 border border-primary/30 rounded-lg max-w-full mx-auto"
                  style={{ aspectRatio: `${parseInt(width) || 1} / ${parseInt(height) || 1}`, maxHeight: '120px' }} />
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'scale' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1.5 block">Ratio Width</Label>
              <Input value={ratioW} onChange={e => setRatioW(e.target.value)} type="number" min={1} className="h-9 font-mono" />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Ratio Height</Label>
              <Input value={ratioH} onChange={e => setRatioH(e.target.value)} type="number" min={1} className="h-9 font-mono" />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">Enter one dimension — the other will be calculated</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1.5 block">Width (px)</Label>
              <Input value={scaleW} onChange={e => handleScaleW(e.target.value)} type="number" min={1} className="h-9 font-mono" />
            </div>
            <div>
              <Label className="text-xs mb-1.5 block">Height (px)</Label>
              <Input value={scaleH} onChange={e => handleScaleH(e.target.value)} type="number" min={1} className="h-9 font-mono" />
            </div>
          </div>

          {scaled && (
            <div className="rounded-xl border bg-muted/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Dimensions</span>
                <Badge className="font-mono">{Math.round(scaled.w)} × {Math.round(scaled.h)}</Badge>
              </div>
              <div className="bg-primary/20 border border-primary/30 rounded-lg max-w-full mx-auto"
                style={{ aspectRatio: `${parseFloat(ratioW) || 1} / ${parseFloat(ratioH) || 1}`, maxHeight: '120px' }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

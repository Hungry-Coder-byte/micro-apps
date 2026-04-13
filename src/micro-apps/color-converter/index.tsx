'use client'

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'

// ── conversions ────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const m = full.match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i)
  if (!m) return null
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase()
}
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, Math.round(l * 100)]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => Math.round((l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))) * 255)
  return [f(0), f(8), f(4)]
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 text-xs"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) }}>
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </Button>
  )
}

export default function ColorConverter() {
  const [hex, setHex]   = useState('#3B82F6')
  const [rgb, setRgb]   = useState<[number, number, number]>([59, 130, 246])
  const [hsl, setHsl]   = useState<[number, number, number]>([217, 91, 60])
  const [hexErr, setHexErr] = useState(false)

  const fromHex = useCallback((v: string) => {
    setHex(v)
    const r = hexToRgb(v)
    if (!r) { setHexErr(v.replace('#', '').length > 0); return }
    setHexErr(false)
    setRgb(r)
    setHsl(rgbToHsl(...r))
  }, [])

  const fromRgb = useCallback((idx: number, v: string) => {
    const n = Math.max(0, Math.min(255, parseInt(v) || 0))
    const next: [number, number, number] = [...rgb]
    next[idx] = n
    setRgb(next)
    setHex(rgbToHex(...next))
    setHsl(rgbToHsl(...next))
    setHexErr(false)
  }, [rgb])

  const fromHsl = useCallback((idx: number, v: string) => {
    const max = [360, 100, 100][idx]
    const n = Math.max(0, Math.min(max, parseInt(v) || 0))
    const next: [number, number, number] = [...hsl]
    next[idx] = n
    setHsl(next)
    const r = hslToRgb(...next)
    setRgb(r)
    setHex(rgbToHex(...r))
    setHexErr(false)
  }, [hsl])

  const cssHex = hex.startsWith('#') ? hex : `#${hex}`
  const validColor = !hexErr

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Preview */}
      <div className="h-20 rounded-xl border shadow-inner transition-colors duration-200"
        style={{ backgroundColor: validColor ? cssHex : '#e5e7eb' }} />

      {/* HEX */}
      <div>
        <Label className="text-xs mb-1.5 block">HEX</Label>
        <Input value={hex} onChange={e => fromHex(e.target.value)}
          placeholder="#RRGGBB" className={`font-mono ${hexErr ? 'border-destructive' : ''}`} maxLength={7} />
        {hexErr && <p className="text-xs text-destructive mt-1">Invalid hex colour</p>}
      </div>

      {/* RGB */}
      <div>
        <Label className="text-xs mb-2 block">RGB</Label>
        <div className="grid grid-cols-3 gap-3">
          {(['R', 'G', 'B'] as const).map((c, i) => (
            <div key={c} className="text-center">
              <p className="text-[10px] text-muted-foreground mb-1">{c} · 0–255</p>
              <Input type="number" min={0} max={255} value={rgb[i]}
                onChange={e => fromRgb(i, e.target.value)} className="font-mono text-center h-9" />
            </div>
          ))}
        </div>
      </div>

      {/* HSL */}
      <div>
        <Label className="text-xs mb-2 block">HSL</Label>
        <div className="grid grid-cols-3 gap-3">
          {[['H', '0–360'], ['S', '0–100'], ['L', '0–100']].map(([c, range], i) => (
            <div key={c} className="text-center">
              <p className="text-[10px] text-muted-foreground mb-1">{c} · {range}</p>
              <Input type="number" min={0} max={i === 0 ? 360 : 100} value={hsl[i]}
                onChange={e => fromHsl(i, e.target.value)} className="font-mono text-center h-9" />
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border bg-muted/30 p-4 space-y-2 text-sm font-mono">
        {[
          { label: 'HEX', value: hex.toUpperCase(), copy: hex.toUpperCase() },
          { label: 'RGB', value: `rgb(${rgb.join(', ')})`, copy: `rgb(${rgb.join(', ')})` },
          { label: 'HSL', value: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`, copy: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` },
        ].map(({ label, value, copy }) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground w-10 shrink-0 text-xs">{label}</span>
            <span className="flex-1 truncate">{value}</span>
            <CopyBtn text={copy} />
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { useClipboard } from '@/hooks/useClipboard'
import { Copy, Check } from 'lucide-react'

function toDMS(dd: number, isLat: boolean): string {
  const abs = Math.abs(dd)
  const d = Math.floor(abs)
  const mFloat = (abs - d) * 60
  const m = Math.floor(mFloat)
  const s = ((mFloat - m) * 60).toFixed(2)
  const dir = isLat ? (dd >= 0 ? 'N' : 'S') : (dd >= 0 ? 'E' : 'W')
  return `${d}° ${m}' ${s}" ${dir}`
}

function toDDM(dd: number, isLat: boolean): string {
  const abs = Math.abs(dd)
  const d = Math.floor(abs)
  const m = ((abs - d) * 60).toFixed(4)
  const dir = isLat ? (dd >= 0 ? 'N' : 'S') : (dd >= 0 ? 'E' : 'W')
  return `${d}° ${m}' ${dir}`
}

export default function MapCoordinates() {
  const [lat, setLat] = useState('40.7128')
  const [lon, setLon] = useState('-74.0060')
  const { copy, copied } = useClipboard()
  const [copiedKey, setCopiedKey] = useState('')

  const formats = useMemo(() => {
    const la = parseFloat(lat)
    const lo = parseFloat(lon)
    if (isNaN(la) || isNaN(lo)) return null
    if (la < -90 || la > 90 || lo < -180 || lo > 180) return null

    return [
      { label: 'Decimal Degrees (DD)', value: `${la.toFixed(6)}, ${lo.toFixed(6)}` },
      { label: 'Degrees Minutes Seconds (DMS)', value: `${toDMS(la, true)}, ${toDMS(lo, false)}` },
      { label: 'Degrees Decimal Minutes (DDM)', value: `${toDDM(la, true)}, ${toDDM(lo, false)}` },
      { label: 'Signed DD', value: `${la >= 0 ? '+' : ''}${la.toFixed(6)}, ${lo >= 0 ? '+' : ''}${lo.toFixed(6)}` },
      { label: 'Google Maps Link', value: `https://maps.google.com/?q=${la},${lo}` },
      { label: 'OSM Link', value: `https://www.openstreetmap.org/?mlat=${la}&mlon=${lo}&zoom=15` },
    ]
  }, [lat, lon])

  function copyFmt(key: string, value: string) {
    copy(value)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(''), 2000)
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Latitude (-90 to 90)</label>
          <Input value={lat} onChange={e => setLat(e.target.value)} placeholder="40.7128" className="font-mono" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Longitude (-180 to 180)</label>
          <Input value={lon} onChange={e => setLon(e.target.value)} placeholder="-74.0060" className="font-mono" />
        </div>
      </div>

      {formats ? (
        <div className="rounded-md border overflow-hidden">
          <div className="bg-muted px-4 py-2 text-sm font-semibold">Coordinate Formats</div>
          <table className="w-full text-sm">
            <tbody>
              {formats.map(f => (
                <tr key={f.label} className="border-t hover:bg-muted/30">
                  <td className="px-4 py-2 text-muted-foreground font-medium whitespace-nowrap">{f.label}</td>
                  <td className="px-4 py-2 font-mono break-all">
                    {f.label.includes('Link') ? (
                      <a href={f.value} target="_blank" rel="noopener" className="text-primary underline text-xs">{f.value}</a>
                    ) : f.value}
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={() => copyFmt(f.label, f.value)} className="text-muted-foreground hover:text-foreground">
                      {copiedKey === f.label ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          Invalid coordinates. Latitude must be -90 to 90, Longitude -180 to 180.
        </div>
      )}

      <div className="rounded-md border bg-muted/30 p-3 space-y-1 text-sm text-muted-foreground">
        <p><strong>Example locations:</strong></p>
        <div className="flex gap-2 flex-wrap">
          {[['NYC', '40.7128', '-74.0060'], ['London', '51.5074', '-0.1278'], ['Tokyo', '35.6762', '139.6503'], ['Sydney', '-33.8688', '151.2093']].map(([name, la, lo]) => (
            <button key={name} onClick={() => { setLat(la); setLon(lo) }} className="text-primary underline text-xs">{name}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

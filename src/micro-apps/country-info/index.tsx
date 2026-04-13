'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Globe2, Construction } from 'lucide-react'

const SAMPLE = [
  ['Country',        'Japan'],
  ['Capital',        'Tokyo'],
  ['Population',     '125,700,000'],
  ['Area',           '377,975 km²'],
  ['Currency',       'Japanese Yen (JPY) ¥'],
  ['Languages',      'Japanese'],
  ['Continent',      'Asia'],
  ['Calling code',   '+81'],
  ['TLD',            '.jp'],
  ['Drives on',      'Left'],
  ['UN member',      'Yes (1956)'],
  ['ISO 3166-1',     'JP / JPN / 392'],
]

const NEIGHBORS = ['Russia', 'China', 'South Korea', 'North Korea']

export default function CountryInfo() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <Label className="text-xs mb-1.5 block">Country name or code</Label>
        <div className="flex gap-2">
          <Input defaultValue="Japan" placeholder="Japan or JP or JPN" className="h-9 flex-1" />
          <Button disabled className="h-9 gap-2 opacity-60">
            <Globe2 className="h-4 w-4" /> Look Up
          </Button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 flex items-center gap-3">
          <span className="text-3xl">🇯🇵</span>
          <div>
            <p className="text-sm font-semibold">Japan</p>
            <p className="text-xs text-muted-foreground">東京 · Asia/Tokyo</p>
          </div>
        </div>
        <div className="divide-y">
          {SAMPLE.map(([k, v]) => (
            <div key={k} className="px-4 py-2.5 grid grid-cols-3 gap-2 text-xs">
              <span className="text-muted-foreground">{k}</span>
              <span className="col-span-2 font-medium">{v}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t bg-muted/10">
          <p className="text-[10px] text-muted-foreground mb-1.5">Bordering countries / maritime neighbors</p>
          <div className="flex flex-wrap gap-1.5">
            {NEIGHBORS.map(n => (
              <Badge key={n} variant="outline" className="text-[10px]">{n}</Badge>
            ))}
          </div>
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
        <Construction className="h-3.5 w-3.5" /> Coming soon
      </Badge>
    </div>
  )
}

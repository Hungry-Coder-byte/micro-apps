'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MailOpen, Construction } from 'lucide-react'

const PLACES = [
  { place: 'Manhattan',     county: 'New York County', state: 'New York',        lat: '40.7484', lng: '-73.9967' },
  { place: 'Hell Kitchen',  county: 'New York County', state: 'New York',        lat: '40.7638', lng: '-73.9918' },
  { place: 'Chelsea',       county: 'New York County', state: 'New York',        lat: '40.7465', lng: '-74.0014' },
]

export default function PostalCodeLookup() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1.5 block">Postal / ZIP code</Label>
          <Input defaultValue="10001" placeholder="e.g. 10001 or SW1A 1AA" className="h-9 font-mono" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Country</Label>
          <Input defaultValue="United States" placeholder="Country name or code" className="h-9" />
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Details for 10001 · US</div>
        <div className="divide-y text-xs">
          {[
            ['Country',       'United States (US)'],
            ['State',         'New York (NY)'],
            ['County',        'New York County'],
            ['City range',    'New York City (Manhattan)'],
            ['Timezone',      'America/New_York (UTC−5)'],
            ['Type',          'Standard — urban delivery area'],
          ].map(([k, v]) => (
            <div key={k} className="px-4 py-2.5 grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">{k}</span>
              <span className="col-span-2 font-medium">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Neighborhoods included</div>
        <div className="divide-y">
          {PLACES.map(({ place, county, state, lat, lng }) => (
            <div key={place} className="px-4 py-2.5 flex items-center gap-3 text-xs">
              <div className="flex-1">
                <p className="font-medium">{place}</p>
                <p className="text-muted-foreground text-[10px]">{county}, {state}</p>
              </div>
              <span className="font-mono text-muted-foreground text-[10px]">{lat}, {lng}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <MailOpen className="h-4 w-4" /> Look Up
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}

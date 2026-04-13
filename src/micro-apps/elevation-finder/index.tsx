'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MountainSnow, Construction } from 'lucide-react'

const BATCH = [
  { location: 'Mount Everest',      lat: '27.9881', lng: '86.9250',   elev: '8,849 m', ft: '29,032 ft' },
  { location: 'Denver, CO',         lat: '39.7392', lng: '-104.9903', elev: '1,609 m', ft: '5,280 ft'  },
  { location: 'Death Valley, CA',   lat: '36.5054', lng: '-117.0794', elev: '−86 m',   ft: '−282 ft'   },
  { location: 'New York, NY',       lat: '40.7128', lng: '-74.0060',  elev: '10 m',    ft: '33 ft'     },
  { location: 'Amsterdam, NL',      lat: '52.3676', lng: '4.9041',    elev: '−2 m',    ft: '−7 ft'     },
]

export default function ElevationFinder() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1.5 block">Latitude</Label>
          <Input defaultValue="27.9881" placeholder="27.9881" className="h-9 font-mono" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Longitude</Label>
          <Input defaultValue="86.9250" placeholder="86.9250" className="h-9 font-mono" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 opacity-70">
        <div className="rounded-xl border p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Elevation (metres)</p>
          <p className="text-4xl font-bold font-mono text-primary">8,849</p>
          <p className="text-xs text-muted-foreground mt-1">metres above sea level</p>
        </div>
        <div className="rounded-xl border p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Elevation (feet)</p>
          <p className="text-4xl font-bold font-mono text-primary">29,032</p>
          <p className="text-xs text-muted-foreground mt-1">feet above sea level</p>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Notable elevations reference</div>
        <div className="divide-y">
          {BATCH.map(({ location, lat, lng, elev, ft }) => (
            <div key={location} className="px-4 py-2.5 flex items-center gap-3 text-xs">
              <div className="flex-1">
                <p className="font-medium">{location}</p>
                <p className="text-muted-foreground text-[10px] font-mono">{lat}, {lng}</p>
              </div>
              <span className="font-mono text-primary font-semibold shrink-0">{elev}</span>
              <span className="text-muted-foreground text-[10px] font-mono shrink-0 w-16 text-right">{ft}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <MountainSnow className="h-4 w-4" /> Get Elevation
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}

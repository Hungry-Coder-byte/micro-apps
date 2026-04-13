'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin, Construction, ArrowLeftRight } from 'lucide-react'

const FORWARD_RESULTS = [
  { address: '1600 Amphitheatre Pkwy, Mountain View, CA', lat: '37.4224', lng: '-122.0842', confidence: 'High' },
  { address: '1600 Amphitheatre Pkwy, Mountain View, CA 94043', lat: '37.4224', lng: '-122.0842', confidence: 'High' },
]

export default function Geocoder() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium">Forward Geocoding</span>
          <span className="text-muted-foreground text-xs">— Address → Coordinates</span>
        </div>
        <div className="flex gap-2">
          <Input defaultValue="1600 Amphitheatre Pkwy, Mountain View, CA"
            placeholder="Enter a street address…" className="h-9 flex-1 text-xs" />
          <Button disabled className="h-9 gap-2 opacity-60 shrink-0">
            <MapPin className="h-4 w-4" /> Geocode
          </Button>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Results</div>
        <div className="divide-y">
          {FORWARD_RESULTS.map((r, i) => (
            <div key={i} className="px-4 py-3 text-xs space-y-1">
              <p className="font-medium text-sm">{r.address}</p>
              <div className="flex gap-4 text-muted-foreground font-mono">
                <span>Lat: {r.lat}</span>
                <span>Lng: {r.lng}</span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto">{r.confidence}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <ArrowLeftRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">Reverse Geocoding</span>
          <span className="text-muted-foreground text-xs">— Coordinates → Address</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs mb-1 block">Latitude</Label>
            <Input defaultValue="37.4224" className="h-9 font-mono" />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Longitude</Label>
            <Input defaultValue="-122.0842" className="h-9 font-mono" />
          </div>
        </div>
        <div className="rounded-lg border bg-muted/20 px-3 py-2.5 text-xs opacity-70">
          <p className="font-medium">1600 Amphitheatre Pkwy</p>
          <p className="text-muted-foreground">Mountain View, California 94043, United States</p>
        </div>
      </div>

      <div className="px-1 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>

      <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
        <Construction className="h-3.5 w-3.5" /> Coming soon
      </Badge>
    </div>
  )
}

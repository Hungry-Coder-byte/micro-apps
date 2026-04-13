'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlaneTakeoff, Construction, ArrowRight } from 'lucide-react'

const ROUTES = [
  { from: 'JFK', to: 'LHR', fromCity: 'New York',      toCity: 'London',        km: 5_570,  miles: 3_461, duration: '7h 00m' },
  { from: 'LAX', to: 'NRT', fromCity: 'Los Angeles',   toCity: 'Tokyo',         km: 8_815,  miles: 5_479, duration: '11h 15m' },
  { from: 'DXB', to: 'SYD', fromCity: 'Dubai',         toCity: 'Sydney',        km: 12_050, miles: 7_490, duration: '14h 10m' },
  { from: 'CDG', to: 'BOM', fromCity: 'Paris',         toCity: 'Mumbai',        km: 6_600,  miles: 4_101, duration: '8h 30m' },
  { from: 'SIN', to: 'LHR', fromCity: 'Singapore',     toCity: 'London',        km: 10_840, miles: 6_736, duration: '13h 00m' },
]

export default function FlightDistance() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label className="text-xs mb-1.5 block">From</Label>
          <Input defaultValue="JFK" placeholder="Airport code or city" className="h-9 font-mono" />
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground mb-2.5 shrink-0" />
        <div className="flex-1">
          <Label className="text-xs mb-1.5 block">To</Label>
          <Input defaultValue="LHR" placeholder="Airport code or city" className="h-9 font-mono" />
        </div>
        <Button disabled className="h-9 gap-2 opacity-60 shrink-0">
          <PlaneTakeoff className="h-4 w-4" /> Calculate
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 opacity-70">
        {[
          { label: 'Great-circle distance', value: '5,570 km' },
          { label: 'Distance (miles)',       value: '3,461 mi' },
          { label: 'Est. flight time',       value: '7h 00m' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border p-3 text-center">
            <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
            <p className="text-xl font-bold font-mono">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">Popular long-haul routes</div>
        <div className="divide-y">
          {ROUTES.map(({ from, to, fromCity, toCity, km, miles, duration }) => (
            <div key={`${from}-${to}`} className="px-4 py-2.5 flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="font-mono font-bold">{from}</span>
                <span className="text-muted-foreground text-[10px]">{fromCity}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="font-mono font-bold">{to}</span>
                <span className="text-muted-foreground text-[10px]">{toCity}</span>
              </div>
              <span className="font-mono shrink-0">{km.toLocaleString()} km</span>
              <span className="text-muted-foreground text-[10px] shrink-0">{duration}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
        <Construction className="h-3.5 w-3.5" /> Coming soon
      </Badge>
    </div>
  )
}

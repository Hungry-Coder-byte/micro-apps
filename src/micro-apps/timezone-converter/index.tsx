'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock, Construction, ArrowRight } from 'lucide-react'

const ZONES = [
  { city: 'New York',  tz: 'America/New_York',   offset: 'UTC−5',    time: '08:30 AM' },
  { city: 'London',    tz: 'Europe/London',       offset: 'UTC+0',    time: '01:30 PM' },
  { city: 'Dubai',     tz: 'Asia/Dubai',          offset: 'UTC+4',    time: '05:30 PM' },
  { city: 'Mumbai',    tz: 'Asia/Kolkata',        offset: 'UTC+5:30', time: '07:00 PM' },
  { city: 'Singapore', tz: 'Asia/Singapore',      offset: 'UTC+8',    time: '09:30 PM' },
  { city: 'Tokyo',     tz: 'Asia/Tokyo',          offset: 'UTC+9',    time: '10:30 PM' },
  { city: 'Sydney',    tz: 'Australia/Sydney',    offset: 'UTC+11',   time: '12:30 AM+1' },
]

export default function TimezoneConverter() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
        <div>
          <Label className="text-xs mb-1.5 block">Date & Time</Label>
          <Input defaultValue="2024-04-10 13:30" className="h-9 font-mono" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label className="text-xs mb-1.5 block">From</Label>
            <Input defaultValue="America/New_York" className="h-9 font-mono text-xs" />
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground mt-5 shrink-0" />
          <div className="flex-1">
            <Label className="text-xs mb-1.5 block">To</Label>
            <Input defaultValue="Asia/Tokyo" className="h-9 font-mono text-xs" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">World clock — same moment</div>
        <div className="divide-y">
          {ZONES.map(({ city, tz, offset, time }) => (
            <div key={tz} className="px-4 py-2.5 flex items-center gap-3 text-xs">
              <div className="flex-1">
                <p className="font-medium">{city}</p>
                <p className="text-muted-foreground text-[10px]">{tz}</p>
              </div>
              <span className="text-muted-foreground text-[10px] shrink-0">{offset}</span>
              <span className="font-mono font-semibold w-20 text-right shrink-0">{time}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Clock className="h-4 w-4" /> Convert
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}

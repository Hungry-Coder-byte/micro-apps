'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Clock4, Construction, Plus, Trash2 } from 'lucide-react'

const CLOCKS = [
  { city: 'New York',     tz: 'America/New_York',   offset: 'UTC−5',    time: '08:30',  ampm: 'AM', date: 'Mon, Apr 10' },
  { city: 'London',       tz: 'Europe/London',       offset: 'UTC+0',    time: '01:30',  ampm: 'PM', date: 'Mon, Apr 10' },
  { city: 'Paris',        tz: 'Europe/Paris',        offset: 'UTC+1',    time: '02:30',  ampm: 'PM', date: 'Mon, Apr 10' },
  { city: 'Dubai',        tz: 'Asia/Dubai',          offset: 'UTC+4',    time: '05:30',  ampm: 'PM', date: 'Mon, Apr 10' },
  { city: 'Mumbai',       tz: 'Asia/Kolkata',        offset: 'UTC+5:30', time: '07:00',  ampm: 'PM', date: 'Mon, Apr 10' },
  { city: 'Singapore',    tz: 'Asia/Singapore',      offset: 'UTC+8',    time: '09:30',  ampm: 'PM', date: 'Mon, Apr 10' },
  { city: 'Tokyo',        tz: 'Asia/Tokyo',          offset: 'UTC+9',    time: '10:30',  ampm: 'PM', date: 'Mon, Apr 10' },
  { city: 'Los Angeles',  tz: 'America/Los_Angeles', offset: 'UTC−8',    time: '05:30',  ampm: 'AM', date: 'Mon, Apr 10' },
]

export default function WorldClock() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex gap-2">
        <Input defaultValue="" placeholder="Add a city or timezone…" className="h-9 flex-1" />
        <Button disabled className="h-9 gap-2 opacity-60">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-70">
        {CLOCKS.map(({ city, tz, offset, time, ampm, date }) => (
          <div key={tz} className="rounded-xl border p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{city}</p>
              <p className="text-[10px] text-muted-foreground">{offset} · {tz}</p>
              <p className="text-[10px] text-muted-foreground">{date}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-bold font-mono">{time}</span>
              <span className="text-xs text-muted-foreground ml-1">{ampm}</span>
            </div>
            <button disabled className="opacity-40 cursor-not-allowed">
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>

      <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
        <Construction className="h-3.5 w-3.5" /> Coming soon
      </Badge>
    </div>
  )
}

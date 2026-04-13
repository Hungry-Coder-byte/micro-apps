'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sunrise, Construction } from 'lucide-react'

const WEEK = [
  { day: 'Mon Apr 8',  sunrise: '6:28 AM', sunset: '7:42 PM', daylight: '13h 14m', golden: '6:28–6:56 AM' },
  { day: 'Tue Apr 9',  sunrise: '6:26 AM', sunset: '7:43 PM', daylight: '13h 17m', golden: '6:26–6:54 AM' },
  { day: 'Wed Apr 10', sunrise: '6:25 AM', sunset: '7:44 PM', daylight: '13h 19m', golden: '6:25–6:53 AM' },
  { day: 'Thu Apr 11', sunrise: '6:23 AM', sunset: '7:45 PM', daylight: '13h 22m', golden: '6:23–6:51 AM' },
  { day: 'Fri Apr 12', sunrise: '6:22 AM', sunset: '7:46 PM', daylight: '13h 24m', golden: '6:22–6:50 AM' },
]

export default function SunriseSunset() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs mb-1.5 block">Location</Label>
          <Input defaultValue="New York, NY" placeholder="City or lat,lng" className="h-9" />
        </div>
        <div>
          <Label className="text-xs mb-1.5 block">Date</Label>
          <Input type="date" defaultValue="2024-04-10" className="h-9 font-mono" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 opacity-70">
        {[
          { label: 'Sunrise',       value: '6:25 AM',  sub: 'azimuth 79°' },
          { label: 'Sunset',        value: '7:44 PM',  sub: 'azimuth 281°' },
          { label: 'Daylight',      value: '13h 19m',  sub: '+2m 53s vs yesterday' },
          { label: 'Solar Noon',    value: '1:04 PM',  sub: 'altitude 52.4°' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-xl border p-3 text-center">
            <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
            <p className="text-lg font-bold font-mono">{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden opacity-70">
        <div className="px-4 py-2.5 border-b bg-muted/30 text-xs font-medium">7-day forecast</div>
        <div className="divide-y">
          {WEEK.map(({ day, sunrise, sunset, daylight, golden }) => (
            <div key={day} className="px-4 py-2.5 grid grid-cols-4 gap-2 text-xs">
              <span className="text-muted-foreground">{day}</span>
              <span className="font-mono text-amber-500">{sunrise}</span>
              <span className="font-mono text-orange-500">{sunset}</span>
              <span className="text-muted-foreground">{daylight}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 bg-muted/20 text-[10px] text-muted-foreground/60 text-center">(Preview only — functionality coming soon)</div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2 opacity-60">
          <Sunrise className="h-4 w-4" /> Calculate
        </Button>
        <Badge variant="outline" className="gap-1.5 text-amber-600 border-amber-400/40">
          <Construction className="h-3.5 w-3.5" /> Coming soon
        </Badge>
      </div>
    </div>
  )
}
